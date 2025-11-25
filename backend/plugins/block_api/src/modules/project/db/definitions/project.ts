import { Schema } from 'mongoose';

import { BLOCK_PROJECT_STATUS } from '@/project/constants';
import { BLOCK_VERIFICATION_STATUS } from '~/constants';

const locationSchema = new Schema(
  {
    lat: { type: Number, label: 'Lat' },
    lng: { type: Number, label: 'Lng' },
    city: { type: String, label: 'City' },
    district: { type: String, label: 'District' },
    address: { type: String, label: 'Address' },
    parcelId: { type: String, label: 'Parcel ID' },
  },
  { _id: false },
);

export const projectAmenitySchema = new Schema(
  {
    category: { type: String, label: 'Category' },
    amenities: { type: [String], label: 'Amenities' },
  },
  { _id: false },
);

export const projectPriceSchema = new Schema(
  {
    currency: { type: String, label: 'Currency' },
    priceType: { type: String, label: 'Price Type' },
    price: { type: Number, label: 'Price' },
  },
  { _id: false },
);

export const projectSchema = new Schema(
  {
    name: { type: String, label: 'Name' },
    isPublished: { type: Boolean, label: 'Is Published', default: false },
    location: { type: locationSchema, label: 'Location' },

    shortDescription: { type: String, label: 'Short Description' },
    description: { type: String, label: 'Description' },

    status: {
      type: String,
      label: 'Status',
      enum: BLOCK_PROJECT_STATUS.ALL,
      default: BLOCK_PROJECT_STATUS.PLANNED,
    },
    verificationStatus: {
      type: String,
      label: 'Verification Status',
      enum: BLOCK_VERIFICATION_STATUS.ALL,
      default: BLOCK_VERIFICATION_STATUS.PENDING,
    },
    logo: { type: String, label: 'Logo' },
    coverImage: { type: String, label: 'Cover Image' },
    images: { type: [String], label: 'Images' },
    mainPrice: { type: Number, label: 'Price' },
    prices: { type: [projectPriceSchema], label: 'Prices' },
    bankPartners: { type: [String], label: 'Bank Partners' },
    projectAmenities: {
      type: [projectAmenitySchema],
      label: 'Project Amenities',
    },

    types: { type: [String], label: 'Types' },

    startDate: { type: Date, label: 'Start Date' },
    endDate: { type: Date, label: 'End Date' },

    counts: { type: Schema.Types.Mixed, label: 'Counts' },
    metrics: { type: Schema.Types.Mixed, label: 'Metrics' },
    targets: { type: Schema.Types.Mixed, label: 'Targets' },
    contacts: { type: Schema.Types.Mixed, label: 'Contacts' },
    links: { type: Schema.Types.Mixed, label: 'Links' },
    schedules: { type: Schema.Types.Mixed, label: 'Schedules' },
  },
  {
    timestamps: true,
  },
);
