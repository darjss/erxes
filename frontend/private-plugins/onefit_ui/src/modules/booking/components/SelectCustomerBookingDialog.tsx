import { Button, Dialog, Spinner } from 'erxes-ui';
import { getLocalizedString } from '~/modules/activity-type/utils/localization';
import { OneFitBooking } from '../types/booking';

interface SelectCustomerBookingDialogProps {
  bookings: OneFitBooking[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBooking: (booking: OneFitBooking) => void;
  onMarkAll?: (bookingIds: string[]) => void | Promise<void>;
  markAllLoading?: boolean;
}

export function SelectCustomerBookingDialog({
  bookings,
  open,
  onOpenChange,
  onSelectBooking,
  onMarkAll,
  markAllLoading = false,
}: SelectCustomerBookingDialogProps) {
  if (!open) {
    return null;
  }

  async function handleMarkAll() {
    if (!onMarkAll || bookings.length === 0) return;
    const ids = bookings.map((b) => b._id);
    await onMarkAll(ids);
    onOpenChange(false);
  }

  function handleSelect(booking: OneFitBooking) {
    onSelectBooking(booking);
    onOpenChange(false);
  }

  const providerName = (b: OneFitBooking) =>
    b.provider ? getLocalizedString(b.provider.businessName, 'en') : '-';
  const activityName = (b: OneFitBooking) =>
    b.activityType ? getLocalizedString(b.activityType.name, 'en') : '-';
  const dateLabel = (b: OneFitBooking) =>
    new Date(b.bookingDate).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  const timeLabel = (b: OneFitBooking) =>
    `${b.startTime} - ${b.endTime}`;
  const count = bookings.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header>
          <Dialog.Title>This member has multiple bookings</Dialog.Title>
          <Dialog.Description>
            Mark all as attended in one go, or choose one booking to mark
            individually.
          </Dialog.Description>
        </Dialog.Header>

        <div className="flex flex-col gap-2 py-4">
          {onMarkAll && (
            <Button
              type="button"
              onClick={handleMarkAll}
              disabled={markAllLoading}
              className="w-full"
            >
              <Spinner show={markAllLoading} />
              {count === 1
                ? 'Mark as attended'
                : `Mark all ${count} as attended`}
            </Button>
          )}

          <p className="text-sm text-muted-foreground pt-1">
            Or select one:
          </p>
          {bookings.map((booking) => (
            <button
              key={booking._id}
              type="button"
              onClick={() => handleSelect(booking)}
              disabled={markAllLoading}
              className="flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            >
              <span className="font-medium">{providerName(booking)}</span>
              <span className="text-sm text-muted-foreground">
                {activityName(booking)} · {dateLabel(booking)} ·{' '}
                {timeLabel(booking)}
              </span>
            </button>
          ))}
        </div>

        <Dialog.Footer>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
            disabled={markAllLoading}
          >
            Cancel
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
