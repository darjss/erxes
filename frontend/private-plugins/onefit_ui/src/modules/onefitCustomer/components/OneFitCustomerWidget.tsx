import {
  IconCaretDownFilled,
  IconCaretRightFilled,
  IconActivity,
} from '@tabler/icons-react';
import {
  Button,
  Collapsible,
  Label,
  Separator,
  Spinner,
  SideMenu,
} from 'erxes-ui';
import { OneFitCustomersInline } from './OneFitCustomersInline';
import { useOneFitCustomerDetail } from '../hooks/useOneFitCustomerDetail';
import { format } from 'date-fns';
import { OneFitMembershipStatus } from '../types/onefitCustomer';

export const OneFitCustomerWidget = ({
  customerIds,
  scope,
}: {
  customerIds: string[];
  scope: string;
}) => {
  return (
    <SideMenu.Content value="onefitcustomer" className="bg-sidebar">
      <OneFitCustomerWidgetHeader />
      <OneFitCustomerWidgetContent customerIds={customerIds} scope={scope} />
    </SideMenu.Content>
  );
};

export const OneFitCustomerWidgetTrigger = () => (
  <SideMenu.Trigger
    value="onefitcustomer"
    label="OneFit Customer"
    Icon={IconActivity}
  />
);

const OneFitCustomerWidgetHeader = () => {
  return <SideMenu.Header label="OneFit Customer" Icon={IconActivity} />;
};

const OneFitCustomerWidgetContent = ({
  customerIds,
  scope,
}: {
  customerIds: string[];
  scope: string;
}) => {
  if (!customerIds || customerIds.length === 0) {
    return <div className="p-4">No OneFit customers found</div>;
  }
  if (customerIds.length === 1) {
    return (
      <OneFitCustomerWidgetDetail customerId={customerIds[0]} scope={scope} />
    );
  }
  return (
    <div className="p-4 space-y-2">
      {customerIds.map((customerId: string) => {
        return (
          <OneFitCustomerWidgetItem
            key={customerId}
            customerId={customerId}
            scope={scope}
          />
        );
      })}
    </div>
  );
};

const OneFitCustomerWidgetItem = ({
  customerId,
  scope,
}: {
  customerId: string;
  scope: string;
}) => {
  const { oneFitCustomer, loading } = useOneFitCustomerDetail({
    variables: {
      _id: customerId,
    },
    skip: !customerId,
  });

  const { primaryEmail, primaryPhone, oneFitCurrentCreditBalance } =
    oneFitCustomer || {};

  if (loading) {
    return (
      <Spinner containerClassName="py-6 bg-background rounded-lg shadow-xs" />
    );
  }

  if (!oneFitCustomer) {
    return null;
  }

  return (
    <OneFitCustomersInline.Provider customers={[oneFitCustomer]}>
      <div className="bg-background rounded-lg shadow-xs">
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <OneFitCustomersInline.Avatar size="xl" />
            <OneFitCustomersInline.Title />
          </div>
          <div className="text-sm text-accent-foreground flex items-center gap-2 justify-between">
            Credit Balance
            <span className="text-foreground">
              {oneFitCurrentCreditBalance ?? 0}
            </span>
          </div>
          <div className="text-sm text-accent-foreground flex items-center gap-2 justify-between">
            Phone
            <span className="text-foreground">{primaryPhone || '-'}</span>
          </div>
          <div className="text-sm text-accent-foreground flex items-center gap-2 justify-between">
            Email
            <span className="text-foreground">{primaryEmail || '-'}</span>
          </div>
        </div>
        <Separator />
        <div className="py-1 px-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-accent-foreground"
          >
            View details
            <IconCaretDownFilled />
          </Button>
        </div>
      </div>
    </OneFitCustomersInline.Provider>
  );
};

const OneFitCustomerWidgetDetail = ({
  customerId,
  scope,
}: {
  customerId: string;
  scope: string;
}) => {
  const { oneFitCustomer, loading } = useOneFitCustomerDetail({
    variables: {
      _id: customerId,
    },
    skip: !customerId,
  });

  const {
    firstName,
    lastName,
    primaryEmail,
    primaryPhone,
    oneFitMembershipPlanId,
    oneFitMembershipExpiresAt,
    oneFitMembershipStatus,
    oneFitCurrentCreditBalance,
    oneFitTotalCreditsEarned,
    oneFitTotalCreditsUsed,
    oneFitPreferredActivityTypes,
    oneFitBookingPreferences,
    oneFitLastBookingDate,
    oneFitTotalBookings,
  } = oneFitCustomer || {};

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return '-';
    }
  };

  const getMembershipStatusBadge = (status?: OneFitMembershipStatus) => {
    if (!status) return null;
    const statusColors = {
      [OneFitMembershipStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [OneFitMembershipStatus.EXPIRED]: 'bg-red-100 text-red-800',
      [OneFitMembershipStatus.NONE]: 'bg-gray-100 text-gray-800',
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          statusColors[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-2">
      {/* Membership Section */}
      <Collapsible className="group/collapsible-menu bg-background" defaultOpen>
        <div className="p-4">
          <Collapsible.Trigger asChild>
            <Button
              variant="ghost"
              className="w-full text-accent-foreground justify-start text-left"
              size="sm"
            >
              <IconCaretRightFilled className="transition-transform group-data-[state=open]/collapsible-menu:rotate-90" />
              Membership
            </Button>
          </Collapsible.Trigger>
          <Collapsible.Content className="pt-4">
            {loading ? (
              <Spinner containerClassName="py-20" />
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-accent-foreground">
                    Membership Status
                  </Label>
                  <div className="flex items-center gap-2">
                    {getMembershipStatusBadge(oneFitMembershipStatus)}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-accent-foreground">
                    Membership Plan ID
                  </Label>
                  <div className="text-sm text-foreground">
                    {oneFitMembershipPlanId || '-'}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-accent-foreground">
                    Expiration Date
                  </Label>
                  <div className="text-sm text-foreground">
                    {formatDate(oneFitMembershipExpiresAt)}
                  </div>
                </div>
              </div>
            )}
          </Collapsible.Content>
        </div>
        <Separator />
      </Collapsible>

      {/* Credits Section */}
      <Collapsible className="group/collapsible-menu bg-background" defaultOpen>
        <div className="p-4">
          <Collapsible.Trigger asChild>
            <Button
              variant="ghost"
              className="w-full text-accent-foreground justify-start text-left"
              size="sm"
            >
              <IconCaretRightFilled className="transition-transform group-data-[state=open]/collapsible-menu:rotate-90" />
              Credits
            </Button>
          </Collapsible.Trigger>
          <Collapsible.Content className="pt-4">
            {loading ? (
              <Spinner containerClassName="py-20" />
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-accent-foreground">
                    Current Balance
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    {oneFitCurrentCreditBalance ?? 0}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-accent-foreground">
                    Total Earned
                  </Label>
                  <div className="text-sm text-foreground">
                    {oneFitTotalCreditsEarned ?? 0}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-accent-foreground">
                    Total Used
                  </Label>
                  <div className="text-sm text-foreground">
                    {oneFitTotalCreditsUsed ?? 0}
                  </div>
                </div>
              </div>
            )}
          </Collapsible.Content>
        </div>
        <Separator />
      </Collapsible>

      {/* Bookings Section */}
      <Collapsible className="group/collapsible-menu bg-background" defaultOpen>
        <div className="p-4">
          <Collapsible.Trigger asChild>
            <Button
              variant="ghost"
              className="w-full text-accent-foreground justify-start text-left"
              size="sm"
            >
              <IconCaretRightFilled className="transition-transform group-data-[state=open]/collapsible-menu:rotate-90" />
              Bookings
            </Button>
          </Collapsible.Trigger>
          <Collapsible.Content className="pt-4">
            {loading ? (
              <Spinner containerClassName="py-20" />
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-accent-foreground">
                    Total Bookings
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    {oneFitTotalBookings ?? 0}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-accent-foreground">
                    Last Booking Date
                  </Label>
                  <div className="text-sm text-foreground">
                    {formatDate(oneFitLastBookingDate)}
                  </div>
                </div>
                {oneFitPreferredActivityTypes &&
                  oneFitPreferredActivityTypes.length > 0 && (
                    <div className="space-y-1">
                      <Label className="text-xs text-accent-foreground">
                        Preferred Activity Types
                      </Label>
                      <div className="flex flex-wrap gap-1">
                        {oneFitPreferredActivityTypes.map((type, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded text-xs bg-primary/10 text-primary"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                {oneFitBookingPreferences && (
                  <div className="space-y-2">
                    <Label className="text-xs text-accent-foreground">
                      Booking Preferences
                    </Label>
                    {oneFitBookingPreferences.preferredTimeSlots &&
                      oneFitBookingPreferences.preferredTimeSlots.length >
                        0 && (
                        <div className="space-y-1">
                          <div className="text-xs text-accent-foreground">
                            Preferred Time Slots:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {oneFitBookingPreferences.preferredTimeSlots.map(
                              (slot, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground"
                                >
                                  {slot}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    {oneFitBookingPreferences.preferredDays &&
                      oneFitBookingPreferences.preferredDays.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs text-accent-foreground">
                            Preferred Days:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {oneFitBookingPreferences.preferredDays.map(
                              (day, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground"
                                >
                                  {day}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    {oneFitBookingPreferences.notificationEnabled !==
                      undefined && (
                      <div className="space-y-1">
                        <div className="text-xs text-accent-foreground">
                          Notifications:
                        </div>
                        <div className="text-sm text-foreground">
                          {oneFitBookingPreferences.notificationEnabled
                            ? 'Enabled'
                            : 'Disabled'}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </Collapsible.Content>
        </div>
        <Separator />
      </Collapsible>

      {/* Contact Information */}
      <Collapsible className="group/collapsible-menu bg-background">
        <div className="p-4">
          <Collapsible.Trigger asChild>
            <Button
              variant="ghost"
              className="w-full text-accent-foreground justify-start text-left"
              size="sm"
            >
              <IconCaretRightFilled className="transition-transform group-data-[state=open]/collapsible-menu:rotate-90" />
              Contact Information
            </Button>
          </Collapsible.Trigger>
          <Collapsible.Content className="pt-4">
            {loading ? (
              <Spinner containerClassName="py-20" />
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-accent-foreground">Email</Label>
                  <div className="text-sm text-foreground">
                    {primaryEmail || '-'}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-accent-foreground">Phone</Label>
                  <div className="text-sm text-foreground">
                    {primaryPhone || '-'}
                  </div>
                </div>
              </div>
            )}
          </Collapsible.Content>
        </div>
        <Separator />
      </Collapsible>
    </div>
  );
};
