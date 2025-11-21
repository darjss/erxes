import { Schema } from 'mongoose';

import {
  BTK_PROJECT_STATUS,
  BTK_VERIFICATION_STATUS,
} from '~/modules/news/constants';

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

export const newsAmenitySchema = new Schema(
  {
    category: { type: String, label: 'Category' },
    amenities: { type: [String], label: 'Amenities' },
  },
  { _id: false },
);

export const newsSchema = new Schema(
  {
    name: { type: String, label: 'Name' },
    isPublished: { type: Boolean, label: 'Is Published', default: false },
    location: { type: locationSchema, label: 'Location' },
    status: {
      type: String,
      label: 'Status',
      enum: BTK_PROJECT_STATUS.ALL,
      default: BTK_PROJECT_STATUS.PLANNED,
    },
    verificationStatus: {
      type: String,
      label: 'Verification Status',
      enum: BTK_VERIFICATION_STATUS.ALL,
      default: BTK_VERIFICATION_STATUS.PENDING,
    },
    companyId: {
      type: String,
      label: 'Company ID',
    },
    title: {
      type: String,
      label: 'Title',
    },
    content: {
      type: String,
      label: 'Content',
    },
    coverImage: { type: String, label: 'Cover Image' },
    images: { type: [String], label: 'Images' },
    logo: { type: String, label: 'Logo' },
    newsAmenities: {
      type: [newsAmenitySchema],
      label: 'News Amenities',
    },

    startDate: { type: Date, label: 'Start Date' },
    endDate: { type: Date, label: 'End Date' },
  },
  {
    timestamps: true,
  },
);
