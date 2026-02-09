import { Button, Dialog } from 'erxes-ui';
import { getLocalizedString } from '~/modules/activity-type/utils/localization';
import { OneFitBooking } from '../types/booking';

interface SelectCustomerBookingDialogProps {
  bookings: OneFitBooking[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBooking: (booking: OneFitBooking) => void;
}

export function SelectCustomerBookingDialog({
  bookings,
  open,
  onOpenChange,
  onSelectBooking,
}: SelectCustomerBookingDialogProps) {
  if (!open) {
    return null;
  }

  function handleSelect(booking: OneFitBooking) {
    onSelectBooking(booking);
    onOpenChange(false);
  }

  const providerName = (b: OneFitBooking) =>
    b.provider ? getLocalizedString(b.provider.businessName, 'en') : '-';
  const activityName = (b: OneFitBooking) =>
    b.activityType ? getLocalizedString(b.activityType.name, 'en') : '-';
  const timeLabel = (b: OneFitBooking) =>
    `${b.startTime} - ${b.endTime}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header>
          <Dialog.Title>Select booking</Dialog.Title>
          <Dialog.Description>
            This customer has multiple bookings today. Choose one to mark
            attendance.
          </Dialog.Description>
        </Dialog.Header>

        <div className="flex flex-col gap-2 py-4">
          {bookings.map((booking) => (
            <button
              key={booking._id}
              type="button"
              onClick={() => handleSelect(booking)}
              className="flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <span className="font-medium">{providerName(booking)}</span>
              <span className="text-sm text-muted-foreground">
                {activityName(booking)} · {timeLabel(booking)}
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
          >
            Cancel
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
