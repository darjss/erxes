import { Button, Dialog, DropdownMenu, Label, Textarea } from 'erxes-ui';
import { ReactNode, useState } from 'react';
import { useUpdateSupplierVerification } from '../hooks/useUpdateSupplierVerification';

const STATUSES = ['verified', 'unverified'];

export const SupplierVerificationAction = ({
  supplierId,
  status,
  children,
}: {
  supplierId: string;
  status?: string;
  children: ReactNode;
}) => {
  const { updateVerification } = useUpdateSupplierVerification();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [note, setNote] = useState('');

  const handleSelect = (s: string) => {
    if (s === 'unverified') {
      setNote('');
      setRejectOpen(true);
    } else {
      updateVerification(supplierId, s);
    }
  };

  const handleConfirmReject = () => {
    updateVerification(supplierId, 'unverified', note);
    setRejectOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          {STATUSES.map((s) => (
            <DropdownMenu.Item
              key={s}
              disabled={s === status}
              onClick={() => handleSelect(s)}
            >
              Mark as {s}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <Dialog.Content className="sm:max-w-md">
          <Dialog.Header>
            <Dialog.Title>Reject supplier</Dialog.Title>
            <Dialog.Description>
              Provide a reason for rejection. This note will be sent to the supplier.
            </Dialog.Description>
          </Dialog.Header>
          <div className="flex flex-col gap-2">
            <Label htmlFor="reject-note">Note</Label>
            <Textarea
              id="reject-note"
              placeholder="Enter rejection reason..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>
          <Dialog.Footer>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmReject}>
              Reject
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  );
};
