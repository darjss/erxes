import { IconRefresh } from '@tabler/icons-react';
import { AlertDialog, Button } from 'erxes-ui';

interface RestartServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const RestartServerDialog = ({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}: RestartServerDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content className="sm:max-w-md">
        <AlertDialog.Header className="flex flex-row gap-3 sm:flex-row">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <IconRefresh className="text-primary h-5 w-5" />
          </div>
          <div className="flex flex-col gap-2 text-left">
            <AlertDialog.Title className="text-base font-semibold">
              Restart AI BOT?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-muted-foreground text-sm">
              This will stop and restart your assistant. It may take 1–2
              minutes. You won't be able to chat during this time.
            </AlertDialog.Description>
          </div>
        </AlertDialog.Header>
        <AlertDialog.Footer className="flex gap-2 sm:justify-end">
          <AlertDialog.Cancel type="button" disabled={loading}>
            Cancel
          </AlertDialog.Cancel>
          <Button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="min-w-28"
          >
            Restart
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};
