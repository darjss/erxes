import { IModels } from '~/connectionResolvers';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import {
  CreditTransactionType,
  CreditSource,
} from '@/membership/@types/credittransaction';

interface CpNotificationData {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  contentType?: string;
  contentTypeId?: string;
  metadata?: Record<string, unknown>;
}

async function sendCpNotificationByErxesCustomerId(
  subdomain: string,
  erxesCustomerId: string,
  data: CpNotificationData,
): Promise<void> {
  const listResult = await sendTRPCMessage({
    subdomain: 'os',
    pluginName: 'core',
    method: 'query',
    module: 'cpUsers',
    action: 'list',
    input: { erxesCustomerId, limit: 100 },
    defaultValue: { list: [], totalCount: 0 },
  });
  const list = listResult?.list ?? [];
  if (!list.length) {
    return;
  }

  const byPortal = new Map<string, string[]>();
  for (const user of list) {
    const portalId = user?.clientPortalId;
    if (!portalId) continue;
    const ids = byPortal.get(portalId) ?? [];
    ids.push(user._id);
    byPortal.set(portalId, ids);
  }

  for (const [clientPortalId, cpUserIds] of byPortal.entries()) {
    await sendTRPCMessage({
      subdomain: 'os',
      pluginName: 'core',
      method: 'mutation',
      module: 'cpNotifications',
      action: 'create',
      input: { cpUserIds, clientPortalId, data },
      defaultValue: null,
    });
  }
}

export async function processCreditExpiration(
  models: IModels,
  subdomain: string,
) {
  const now = new Date();

  // Auto-clear hold: end hold for customers whose hold period has passed; add hold days to membership expiry
  const holdsToClear = await models.OneFitCustomer.findOneFitCustomers({
    isMembershipOnHold: true,
    membershipHoldEndAt: { $lt: now },
  });
  for (const customer of holdsToClear) {
    const startAt = customer.membershipHoldStartAt
      ? new Date(customer.membershipHoldStartAt)
      : now;
    const endAt = customer.membershipHoldEndAt
      ? new Date(customer.membershipHoldEndAt)
      : now;
    const daysHeld = Math.max(
      0,
      Math.floor((endAt.getTime() - startAt.getTime()) / (24 * 60 * 60 * 1000)),
    );
    const currentExpiresAt = customer.membershipExpiresAt
      ? new Date(customer.membershipExpiresAt)
      : now;
    const newExpiresAt = new Date(
      currentExpiresAt.getTime() + daysHeld * 24 * 60 * 60 * 1000,
    );
    const membershipStatus =
      newExpiresAt > now ? 'active' : newExpiresAt < now ? 'expired' : 'none';
    await models.OneFitCustomer.findOneAndUpdate(
      { _id: customer._id, __t: 'OneFitCustomer' },
      {
        $set: {
          membershipExpiresAt: newExpiresAt,
          membershipStatus,
          isMembershipOnHold: false,
          membershipHoldEndedAt: now,
        },
        $unset: {
          membershipHoldStartAt: 1,
          membershipHoldEndAt: 1,
        },
      },
      { new: true },
    );
  }

  // Get grace period duration from config (default 7 days)
  const gracePeriodConfig =
    await models.SystemConfig.getConfig('grace_period_days');
  const gracePeriodDays = gracePeriodConfig?.value || 7;

  // Find expired customers with credits (exclude customers still on hold)
  const expiredCustomers = await models.OneFitCustomer.findOneFitCustomers({
    membershipExpiresAt: { $lt: now },
    currentCreditBalance: { $gt: 0 },
    $or: [
      { isMembershipOnHold: { $ne: true } },
      { membershipHoldEndAt: { $lt: now } },
    ],
  });

  for (const customer of expiredCustomers) {
    const creditBalance = customer.currentCreditBalance || 0;

    // Check if already in grace period
    if (customer.isInGracePeriod) {
      // Check if grace period has ended
      if (customer.gracePeriodEnd && customer.gracePeriodEnd < now) {
        // Grace period ended, forfeit remaining credits
        if (creditBalance > 0) {
          const balanceAfter = await models.CreditTransaction.getUserBalance(
            customer._id,
          );

          // Create expiration transaction
          await models.CreditTransaction.createTransaction({
            userId: customer._id,
            amount: -creditBalance,
            transactionType: CreditTransactionType.EXPIRATION,
            source: CreditSource.INDIVIDUAL,
            description: 'Credit expiration after grace period',
            balanceAfter: balanceAfter - creditBalance,
          });

          // Update OneFitCustomer credit balance fields
          await models.OneFitCustomer.updateCreditBalanceAndUsed(
            customer._id,
            balanceAfter - creditBalance,
            creditBalance,
          );

          // Mark as expired and end grace period
          await models.OneFitCustomer.findOneAndUpdate(
            { _id: customer._id, __t: 'OneFitCustomer' },
            {
              $set: {
                isInGracePeriod: false,
                isExpired: true,
                currentCreditBalance: 0,
              },
            },
            { new: true },
          );

          await sendCpNotificationByErxesCustomerId(subdomain, customer._id, {
            title: 'Кредит дууссан',
            message: `Таны ${creditBalance} кредит нэмэлт хугацаа дууссаны дараа хүчингүй боллоо.`,
            type: 'error',
            contentType: 'onefit:creditExpiration',
            contentTypeId: customer._id,
            metadata: { expiredCredits: creditBalance },
          });
        }
      } else {
        // Still in grace period, check if 2 days before end
        if (customer.gracePeriodEnd) {
          const twoDaysBefore = new Date(
            customer.gracePeriodEnd.getTime() - 2 * 24 * 60 * 60 * 1000,
          );
          if (now >= twoDaysBefore && now < customer.gracePeriodEnd) {
            await sendCpNotificationByErxesCustomerId(subdomain, customer._id, {
              title: 'Нэмэлт хугацаа дуусах гэж байна',
              message:
                'Нэмэлт хугацаа 2 хоногийн дараа дуусна. Кредитээ хадгалахын тулд одоо цэнэглэнэ үү.',
              type: 'warning',
              contentType: 'onefit:creditExpiration',
              contentTypeId: customer._id,
              metadata: {
                creditBalance,
                gracePeriodEnd: customer.gracePeriodEnd,
              },
            });
          }
        }
      }
    } else {
      // Start grace period
      const gracePeriodStart = new Date();
      const gracePeriodEnd = new Date(
        gracePeriodStart.getTime() + gracePeriodDays * 24 * 60 * 60 * 1000,
      );

      await models.OneFitCustomer.findOneAndUpdate(
        { _id: customer._id, __t: 'OneFitCustomer' },
        {
          $set: {
            isInGracePeriod: true,
            gracePeriodStart,
            gracePeriodEnd,
          },
        },
        { new: true },
      );

      await sendCpNotificationByErxesCustomerId(subdomain, customer._id, {
        title: 'Кредит түр хадгалах хугацаа эхэллээ',
        message: `Таны багцын хугацаа дууссан. ${creditBalance} кредитээ хадгалахын тулд ${gracePeriodDays} хоног байна. Та цэнэглэлт хийж хадгалах боломжтой.`,
        type: 'warning',
        contentType: 'onefit:creditExpiration',
        contentTypeId: customer._id,
        metadata: {
          creditBalance,
          gracePeriodDays,
          gracePeriodEnd,
        },
      });
    }
  }
}
