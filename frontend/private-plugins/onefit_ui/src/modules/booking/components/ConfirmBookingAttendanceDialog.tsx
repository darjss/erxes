import { Alert, Badge, Button, Dialog, Spinner } from 'erxes-ui';
import { useMarkAttendance } from '../hooks/useBookingMutations';
import { OneFitBooking } from '../types/booking';
import { AttendanceStatus } from '../types/booking';
import { startOfDay } from 'date-fns';
import { getLocalizedString } from '~/modules/activity-type/utils/localization';
import { OneFitCustomersInline } from '~/modules/onefitCustomer/components/OneFitCustomersInline';

interface ConfirmBookingAttendanceDialogProps {
  booking: OneFitBooking | null;
  loading?: boolean;
  error?: Error | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export function ConfirmBookingAttendanceDialog({
  booking,
  loading: bookingLoading = false,
  error: bookingError,
  open,
  onOpenChange,
  onClose,
}: ConfirmBookingAttendanceDialogProps) {
  const { markAttendance, loading } = useMarkAttendance();

  if (!open) {
    return null;
  }

  if (bookingError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Dialog.Content className="max-w-md">
          <Dialog.Header>
            <Dialog.Title>Алдаа</Dialog.Title>
            <Dialog.Description>
              Захиалгийн мэдээллийг ачааллахад амжилтгүй
            </Dialog.Description>
          </Dialog.Header>
          <div className="flex flex-col gap-4 py-4">
            <Alert variant="destructive">
              <Alert.Title>Алдаа</Alert.Title>
              <Alert.Description>
                {bookingError.message || 'Захиалга олдсонгүй'}
              </Alert.Description>
            </Alert>
          </div>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Хаах
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    );
  }

  if (bookingLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Dialog.Content className="max-w-md">
          <Dialog.Header>
            <Dialog.Title>Захиалгын ирцийг баталгаажуулах</Dialog.Title>
            <Dialog.Description>
              Захиалгийн мэдээллийг ачаалж байна...
            </Dialog.Description>
          </Dialog.Header>
          <div className="flex items-center justify-center py-8">
            <Spinner show={true} />
          </div>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Цуцлах
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    );
  }

  if (!booking) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Dialog.Content className="max-w-md">
          <Dialog.Header>
            <Dialog.Title>Захиалгын ирцийг баталгаажуулах</Dialog.Title>
            <Dialog.Description>
              Захиалгийн мэдээллийг ачаалж байна...
            </Dialog.Description>
          </Dialog.Header>
          <div className="flex items-center justify-center py-8">
            <Spinner show={true} />
          </div>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Цуцлах
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    );
  }

  // At this point, booking is guaranteed to be non-null
  const bookingData = booking;
  const bookingDate = new Date(bookingData.bookingDate);
  const today = startOfDay(new Date());
  const bookingDateOnly = startOfDay(bookingDate);
  const isDateDifferent = bookingDateOnly.getTime() !== today.getTime();

  const customerName = bookingData.user
    ? `${bookingData.user.firstName || ''} ${
        bookingData.user.lastName || ''
      }`.trim() ||
      bookingData.user.primaryEmail ||
      bookingData.user.primaryPhone ||
      'Нэргүй гишүүн'
    : '-';

  const providerName = bookingData.provider
    ? getLocalizedString(bookingData.provider.businessName, 'en')
    : '-';

  const activityTypeName = bookingData.activityType
    ? getLocalizedString(bookingData.activityType.name, 'en')
    : '-';

  function handleMarkAttendance() {
    markAttendance(bookingData._id, AttendanceStatus.ATTENDED);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header>
          <Dialog.Title>Захиалгын ирцийг баталгаажуулах</Dialog.Title>
          <Dialog.Description>
            Ирсэн гэж тэмдэглэхээс өмнө захиалгын дэлгэрэнгүйг шалгана уу
          </Dialog.Description>
        </Dialog.Header>

        <div className="flex flex-col gap-4 py-4">
          {isDateDifferent && (
            <Alert variant="warning" className="mb-2">
              <Alert.Title>Анхааруулга</Alert.Title>
              <Alert.Description>
                Захиалгын огноо өнөөдрөөс өөр. Ирцийг тэмдэглэхээс өмнө шалгана уу.
              </Alert.Description>
            </Alert>
          )}

          <div className="flex flex-col gap-3 text-sm">
            <div>
              <span className="text-muted-foreground font-medium">
                Гишүүн:
              </span>
              <div className="mt-1">
                {bookingData.user ? (
                  <OneFitCustomersInline
                    customers={[
                      {
                        _id: bookingData.user._id,
                        firstName: bookingData.user.firstName,
                        lastName: bookingData.user.lastName,
                        primaryEmail: bookingData.user.primaryEmail,
                        primaryPhone: bookingData.user.primaryPhone,
                        createdAt: '',
                        updatedAt: '',
                      },
                    ]}
                    placeholder="Нэргүй гишүүн"
                  />
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-muted-foreground font-medium">
                Үйлчилгээ үзүүлэгч:
              </span>
              <div className="mt-1 font-medium">{providerName}</div>
            </div>

            <div>
              <span className="text-muted-foreground font-medium">
                Үйл ажиллагааны төрөл:
              </span>
              <div className="mt-1 font-medium">{activityTypeName}</div>
            </div>

            <div>
              <span className="text-muted-foreground font-medium">
                Захиалгын огноо:
              </span>
              <div className="mt-1 font-medium">
                {bookingDate.toLocaleDateString()} {bookingData.startTime} -{' '}
                {bookingData.endTime}
              </div>
            </div>

            <div>
              <span className="text-muted-foreground font-medium">Төлөв:</span>
              <div className="mt-1">
                <Badge variant="secondary">{bookingData.status}</Badge>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground font-medium">
                Ирцийн төлөв:
              </span>
              <div className="mt-1">
                <Badge variant="secondary">
                  {bookingData.attendanceStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Dialog.Footer className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Цуцлах
          </Button>
          <Button
            type="button"
            onClick={handleMarkAttendance}
            disabled={loading}
            className="flex-1"
          >
            <Spinner show={loading} />
            Ирсэн гэж тэмдэглэх
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
