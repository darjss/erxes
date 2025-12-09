import { IModels } from '~/connectionResolvers';
import {
  NotificationType,
  NotificationChannel,
} from '@/notification/@types/notification';
import {
  CreditTransactionType,
  CreditSource,
} from '@/membership/@types/credittransaction';

export async function processCreditExpiration(models: IModels) {
  const now = new Date();

  // Get grace period duration from config (default 7 days)
  const gracePeriodConfig = await models.SystemConfig.getConfig(
    'grace_period_days',
  );
  const gracePeriodDays = gracePeriodConfig?.value || 7;

  // Find expired customers with credits
  const expiredCustomers = await models.OneFitCustomer.findOneFitCustomers({
    membershipExpiresAt: { $lt: now },
    isExpired: false,
    currentCreditBalance: { $gt: 0 },
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

          // Send notification
          await models.Notification.createNotification({
            userId: customer._id,
            type: NotificationType.CREDIT_EXPIRATION,
            channel: NotificationChannel.IN_APP,
            title: 'Credits Expired',
            message: `Your ${creditBalance} credits have expired after the grace period.`,
            relatedId: customer._id,
            isRead: false,
          });
        }
      } else {
        // Still in grace period, check if 2 days before end
        if (customer.gracePeriodEnd) {
          const twoDaysBefore = new Date(
            customer.gracePeriodEnd.getTime() - 2 * 24 * 60 * 60 * 1000,
          );
          if (now >= twoDaysBefore && now < customer.gracePeriodEnd) {
            // Send reminder notification
            await models.Notification.createNotification({
              userId: customer._id,
              type: NotificationType.GRACE_PERIOD_ENDING,
              channel: NotificationChannel.SMS,
              title: 'Grace Period Ending Soon',
              message: `Your grace period ends in 2 days. Recharge now to save your ${creditBalance} credits.`,
              relatedId: customer._id,
              isRead: false,
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

      // Send notification
      await models.Notification.createNotification({
        userId: customer._id,
        type: NotificationType.GRACE_PERIOD_START,
        channel: NotificationChannel.SMS,
        title: 'Grace Period Started',
        message: `Your plan has expired. You have ${gracePeriodDays} days to recharge and save your ${creditBalance} credits.`,
        relatedId: customer._id,
        isRead: false,
      });
    }
  }
}
