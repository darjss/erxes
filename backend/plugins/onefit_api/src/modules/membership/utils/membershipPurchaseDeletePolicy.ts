import { IMembershipPurchaseDocument } from '@/membership/@types/membershippurchase';

export const MEMBERSHIP_PURCHASE_DELETE_WINDOW_MS = 24 * 60 * 60 * 1000;

export function assertMembershipPurchaseDeletableWithinWindow(
  purchase: IMembershipPurchaseDocument,
): void {
  const purchasedAt = purchase.purchasedAt;
  if (!purchasedAt) {
    throw new Error(
      'Membership purchase cannot be deleted because purchase time is missing',
    );
  }
  const elapsed = Date.now() - new Date(purchasedAt).getTime();
  if (elapsed > MEMBERSHIP_PURCHASE_DELETE_WINDOW_MS) {
    throw new Error(
      'Membership purchase can only be deleted within 24 hours of purchase',
    );
  }
}
