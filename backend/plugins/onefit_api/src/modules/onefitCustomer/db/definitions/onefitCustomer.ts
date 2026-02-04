import { Schema } from 'mongoose';
import { IOneFitCustomer } from '@/onefitCustomer/@types/onefitCustomer';
import { mongooseStringRandomId } from 'erxes-api-shared/utils';

export const onefitCustomerSchema = new Schema(
  {
    _id: mongooseStringRandomId,

    // Membership information
    membershipPlanId: {
      type: String,
      optional: true,
      label: 'Membership Plan ID',
      index: true,
    },
    membershipExpiresAt: {
      type: Date,
      optional: true,
      label: 'Membership Expiration Date',
      esType: 'date',
    },
    membershipStatus: {
      type: String,
      enum: ['active', 'expired', 'none'],
      default: 'none',
      optional: true,
      label: 'Membership Status',
      index: true,
    },

    // Credit information
    currentCreditBalance: {
      type: Number,
      default: 0,
      optional: true,
      label: 'Current Credit Balance',
      esType: 'number',
    },
    totalCreditsEarned: {
      type: Number,
      default: 0,
      optional: true,
      label: 'Total Credits Earned',
      esType: 'number',
    },
    totalCreditsUsed: {
      type: Number,
      default: 0,
      optional: true,
      label: 'Total Credits Used',
      esType: 'number',
    },

    // Booking preferences and history
    preferredActivityTypes: {
      type: [String],
      optional: true,
      label: 'Preferred Activity Types',
    },
    bookingPreferences: {
      type: {
        preferredTimeSlots: [String],
        preferredDays: [String],
        notificationEnabled: Boolean,
      },
      optional: true,
      label: 'Booking Preferences',
    },
    lastBookingDate: {
      type: Date,
      optional: true,
      label: 'Last Booking Date',
      esType: 'date',
    },
    totalBookings: {
      type: Number,
      default: 0,
      optional: true,
      label: 'Total Bookings',
      esType: 'number',
    },
    gracePeriodStart: { type: Date, label: 'Grace Period Start' },
    gracePeriodEnd: { type: Date, label: 'Grace Period End' },
    isExpired: { type: Boolean, default: false, label: 'Is Expired' },
    isInGracePeriod: {
      type: Boolean,
      default: false,
      label: 'Is In Grace Period',
    },
    // Membership hold
    isMembershipOnHold: {
      type: Boolean,
      default: false,
      optional: true,
      label: 'Is Membership On Hold',
    },
    membershipHoldStartAt: {
      type: Date,
      optional: true,
      label: 'Membership Hold Start At',
    },
    membershipHoldEndAt: {
      type: Date,
      optional: true,
      label: 'Membership Hold End At',
    },
    membershipHoldEndedAt: {
      type: Date,
      optional: true,
      label: 'Membership Hold Ended At',
    },
    __t: {
      type: String,
      default: '',
      label: 'Type',
    },
  },
  {
    discriminatorKey: '__t',
  },
);

// Indexes for better query performance
onefitCustomerSchema.index({ membershipPlanId: 1 });
onefitCustomerSchema.index({ membershipStatus: 1 });
onefitCustomerSchema.index({ currentCreditBalance: 1 });
onefitCustomerSchema.index({ lastBookingDate: -1 });
