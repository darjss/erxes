import { Schema } from 'mongoose';
import { IBtkDeveloperDocument } from '@/developer/db/@types/developer';
import { IBtkDeveloperSocialLink } from '@/developer/db/@types/developer';

const btkDeveloperSocialLinkSchema = new Schema<IBtkDeveloperSocialLink>(
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

export const developerSchema = new Schema<IBtkDeveloperDocument>({
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
  socialLinks: { type: btkDeveloperSocialLinkSchema },
  isVerified: { type: Boolean, default: false },
  coverImage: { type: String },
});
