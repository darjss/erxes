import { IconAlertTriangle } from '@tabler/icons-react';
import { AlertDialog, Button } from 'erxes-ui';

interface DestroyServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export const DestroyServerDialog = ({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}: DestroyServerDialogProps) => {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content className="border-destructive/50 sm:max-w-md">
        <AlertDialog.Header className="flex flex-row gap-3 sm:flex-row">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <IconAlertTriangle className="text-destructive h-5 w-5" />
          </div>
          <div className="flex flex-col gap-2 text-left">
            <AlertDialog.Title className="text-base font-semibold">
              Destroy server?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-muted-foreground text-sm">
              This will permanently remove your agent server. Discord bot and
              all associated data will be deleted. This action cannot be undone.
            </AlertDialog.Description>
          </div>
        </AlertDialog.Header>
        <AlertDialog.Footer className="flex gap-2 sm:justify-end">
          <AlertDialog.Cancel type="button" disabled={loading}>
            Cancel
          </AlertDialog.Cancel>
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={handleConfirm}
            className="min-w-28"
          >
            {loading ? 'Destroying server...' : 'Destroy server'}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};
