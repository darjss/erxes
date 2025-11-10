import {
  IBlockDeveloperDocument,
  IBlockDeveloperSocialLink,
} from '@/developer/db/@types/developer';
import { Schema } from 'mongoose';
import { schemaWrapper } from '~/utils';

const blockDeveloperSocialLinkSchema = new Schema<IBlockDeveloperSocialLink>(
  {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    website: { type: String },
  },
  { _id: false },
);

export const developerSchema = schemaWrapper(
  new Schema<IBlockDeveloperDocument>({
    name: { type: String },
    description: { type: String },
    about: { type: String },
    logo: { type: String },
    website: { type: String },
    email: { type: String },
    address: { type: Object },
    dateFounded: { type: Date },
    primaryPhone: { type: String },
    phones: { type: [String] },
    socialLinks: { type: blockDeveloperSocialLinkSchema },
    isVerified: { type: Boolean, default: false },
    coverImage: { type: String },
  }),
);
