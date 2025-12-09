import { Document } from 'mongoose';
import { ICustomer, ICustomerDocument } from 'erxes-api-shared/core-types';

export interface IOneFitCustomer extends ICustomer {
  // Membership information
  membershipPlanId?: string;
  membershipExpiresAt?: Date;
  membershipStatus?: 'active' | 'expired' | 'none';

  // Credit information
  currentCreditBalance?: number;
  totalCreditsEarned?: number;
  totalCreditsUsed?: number;

  // Booking preferences and history
  preferredActivityTypes?: string[];
  bookingPreferences?: {
    preferredTimeSlots?: string[];
    preferredDays?: string[];
    notificationEnabled?: boolean;
  };
  lastBookingDate?: Date;
  totalBookings?: number;
  gracePeriodStart: Date;
  gracePeriodEnd: Date;
  isExpired: boolean;
  isInGracePeriod: boolean;
  // _id: string;
  __t?: string;
}

export interface IOneFitCustomerDocument
  extends ICustomerDocument,
    IOneFitCustomer {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
