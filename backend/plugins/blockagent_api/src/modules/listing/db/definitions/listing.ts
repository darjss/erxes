import { Schema } from 'mongoose';
import { IBlockListingDocument } from '../../@types/listing';

export const blockListingSchema = new Schema<IBlockListingDocument>(
  {
    title: { type: String, label: 'Title' },
    type: { type: String, enum: ['sale', 'rent', 'lease'], default: 'sale' },
    propertyType: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive', 'sold', 'draft'],
      default: 'draft',
    },
    description: { type: String },
    location: {
      city: { type: String, required: true },
      district: { type: String, required: true },
      subDistrict: { type: String },
      short: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    pricing: {
      amount: { type: Number },
      currency: { type: String },
      priceType: {
        type: String,
        enum: ['fixed', 'negotiable', 'onRequest'],
        default: 'fixed',
      },
    },
    specs: {
      area: { type: Number },
      floor: { type: Number },
      totalFloors: { type: Number },
      rooms: { type: Number },
      builtYear: { type: String },
    },
    mediaAttachments: [{ type: String }],
    viewCount: { type: Number },
  },
  {
    timestamps: true,
  },
);
