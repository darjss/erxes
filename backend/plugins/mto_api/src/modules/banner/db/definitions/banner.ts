import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import { BannerType, BannerStatus } from '@/banner/@types/banner';

export const bannerSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    modifiedAt: { type: Date, label: 'Modified at' },

    image: {
      type: String,
      required: true,
      label: 'Image URL',
    },
    providerId: {
      type: String,
      required: true,
      label: 'Provider ID',
    },
    type: {
      type: String,
      enum: Object.values(BannerType),
      required: true,
      label: 'Banner Type',
    },
    status: {
      type: String,
      enum: Object.values(BannerStatus),
      required: true,
      default: BannerStatus.ACTIVE,
      label: 'Status',
    },
    instanceId: { type: String, label: 'Instance ID', index: true },
  },
  {
    timestamps: true,
  },
);

bannerSchema.index({ providerId: 1 });
bannerSchema.index({ status: 1 });
bannerSchema.index({ type: 1 });
bannerSchema.index({ instanceId: 1 });
bannerSchema.index({ providerId: 1, status: 1 });
bannerSchema.index({ type: 1, status: 1 });
