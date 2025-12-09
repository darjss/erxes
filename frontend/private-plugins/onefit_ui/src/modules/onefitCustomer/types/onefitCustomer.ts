export enum OneFitMembershipStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  NONE = 'none',
}

export interface OneFitBookingPreferences {
  preferredTimeSlots?: string[];
  preferredDays?: string[];
  notificationEnabled?: boolean;
}

export interface OneFitCustomer {
  _id: string;
  createdAt: string;
  updatedAt: string;
  // Base customer fields
  firstName?: string;
  lastName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  // OneFit-specific fields
  membershipPlanId?: string;
  membershipExpiresAt?: string;
  membershipStatus?: OneFitMembershipStatus;
  currentCreditBalance?: number;
  totalCreditsEarned?: number;
  totalCreditsUsed?: number;
  preferredActivityTypes?: string[];
  bookingPreferences?: OneFitBookingPreferences;
  lastBookingDate?: string;
  totalBookings?: number;
}

export interface OneFitCustomerListResponse {
  list: OneFitCustomer[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

export interface OneFitCustomerFilters {
  membershipPlanId?: string;
  membershipStatus?: OneFitMembershipStatus;
  minCreditBalance?: number;
  maxCreditBalance?: number;
  preferredActivityTypeId?: string;
}

