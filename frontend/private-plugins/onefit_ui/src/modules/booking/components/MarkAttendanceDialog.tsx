import { Button, Dialog, Spinner } from 'erxes-ui';
import { useMarkAttendance } from '../hooks/useBookingMutations';
import { AttendanceStatus } from '../types/booking';
import { useState } from 'react';

interface MarkAttendanceDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export const MarkAttendanceDialog = ({
  bookingId,
  open,
  onOpenChange,
  onClose,
}: MarkAttendanceDialogProps) => {
  const { markAttendance, loading } = useMarkAttendance();
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus | null>(
    null,
  );

  const handleMarkAttendance = (status: AttendanceStatus) => {
    markAttendance(bookingId, status);
    onClose();
    setSelectedStatus(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Mark Attendance</Dialog.Title>
          <Dialog.Description>
            Select the attendance status for this booking.
          </Dialog.Description>
        </Dialog.Header>
        <div className="flex flex-col gap-4 py-4">
          <Button
            variant={selectedStatus === AttendanceStatus.ATTENDED ? 'default' : 'outline'}
            onClick={() => handleMarkAttendance(AttendanceStatus.ATTENDED)}
            disabled={loading}
            className="w-full"
          >
            <Spinner show={loading && selectedStatus === AttendanceStatus.ATTENDED} />
            Mark as Attended
          </Button>
          <Button
            variant={selectedStatus === AttendanceStatus.NO_SHOW ? 'destructive' : 'outline'}
            onClick={() => handleMarkAttendance(AttendanceStatus.NO_SHOW)}
            disabled={loading}
            className="w-full"
          >
            <Spinner show={loading && selectedStatus === AttendanceStatus.NO_SHOW} />
            Mark as No Show
          </Button>
        </div>
        <Dialog.Footer>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

