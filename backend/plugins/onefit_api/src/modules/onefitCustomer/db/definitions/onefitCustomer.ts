import { Schema } from 'mongoose';
import { IOneFitCustomer } from '@/onefitCustomer/@types/onefitCustomer';
import { mongooseStringRandomId } from 'erxes-api-shared/utils';

export const onefitCustomerSchema = new Schema(
  {
    _id: mongooseStringRandomId,

    // Basic customer profile fields (aligned with core contacts where needed)
    state: {
      type: String,
      label: 'State',
      default: 'customer',
    },
    createdAt: {
      type: Date,
      label: 'Created at',
    },
    updatedAt: {
      type: Date,
      label: 'Modified at',
    },
    avatar: {
      type: String,
      optional: true,
      label: 'Avatar',
    },
    firstName: {
      type: String,
      optional: true,
      label: 'First name',
    },
    lastName: {
      type: String,
      optional: true,
      label: 'Last name',
    },
    middleName: {
      type: String,
      optional: true,
      label: 'Middle name',
    },
    birthDate: {
      type: Date,
      optional: true,
      label: 'Date of birth',
    },
    primaryEmail: {
      type: String,
      optional: true,
      label: 'Primary Email',
    },
    emails: {
      type: [String],
      optional: true,
      label: 'Emails',
    },
    primaryPhone: {
      type: String,
      optional: true,
      label: 'Primary Phone',
    },
    phones: {
      type: [String],
      optional: true,
      label: 'Phones',
    },
    code: {
      type: String,
      optional: true,
      label: 'Code',
    },
    searchText: {
      type: String,
      optional: true,
      label: 'Search value',
    },
    // Onefit2 specific identity fields for easier traceability
    username: {
      type: String,
      optional: true,
      label: 'Username',
    },
    gender: {
      type: String,
      optional: true,
      label: 'Gender',
    },
    crmId: {
      type: Number,
      optional: true,
      label: 'CRM ID',
      index: true,
    },
    onefit2UserId: {
      type: String,
      optional: true,
      label: 'Onefit2 User ID',
      index: true,
    },
    status: {
      type: String,
      optional: true,
      label: 'Status',
    },

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
