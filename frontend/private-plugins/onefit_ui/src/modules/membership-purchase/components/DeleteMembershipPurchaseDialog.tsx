import { Button, Dialog, Spinner } from 'erxes-ui';
import { useDeleteMembershipPurchase } from '../hooks/useMembershipPurchaseMutations';
import { OneFitMembershipPurchase } from '../types/membershipPurchase';

interface DeleteMembershipPurchaseDialogProps {
  purchase: OneFitMembershipPurchase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
}

export function DeleteMembershipPurchaseDialog({
  purchase,
  open,
  onOpenChange,
  onClose,
}: DeleteMembershipPurchaseDialogProps) {
  const { deleteMembershipPurchase, loading } = useDeleteMembershipPurchase();

  const isActivated = Boolean(purchase?.activatedAt);
  const hasPromo = Boolean(purchase?.promoCodeId);

  function handleClose() {
    onOpenChange(false);
    onClose?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Delete membership purchase</Dialog.Title>
          <Dialog.Description>
            The purchase record will be hidden from all lists and reports, but
            kept in the database for audit purposes.
          </Dialog.Description>
        </Dialog.Header>
        <div className="space-y-2 text-sm text-muted-foreground">
          {isActivated && (
            <p>
              This purchase is already activated. Granted credits will be
              refunded and the customer&apos;s membership expiry will be rolled
              back by the plan duration.
            </p>
          )}
          {hasPromo && (
            <p>The promo code usage count will be decremented.</p>
          )}
          <p>This action cannot be undone from the UI.</p>
        </div>
        <Dialog.Footer>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              if (!purchase?._id) return;
              deleteMembershipPurchase({
                variables: { _id: purchase._id },
                onCompleted: () => handleClose(),
              });
            }}
            disabled={loading || !purchase?._id}
          >
            <Spinner show={loading} />
            Delete
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
