import {
  IBtkCompanyDocument,
  IBtkCompanySocialLink,
} from '~/modules/company/db/@types/company';
import { Schema } from 'mongoose';
import { schemaWrapper } from '~/utils';

const btkCompanySocialLinkSchema = new Schema<IBtkCompanySocialLink>(
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

export const companySchema = schemaWrapper(
  new Schema<IBtkCompanyDocument>({
    name: { type: String },
    description: { type: String },
    about: { type: String },
    logo: { type: String },
    website: { type: String },
    email: { type: String },
    address: { type: Object },
    dateFounded: {
      type: Date,
      set: (value: any) => {
        if (!value) return null;
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
      },
    },
    primaryPhone: { type: String },
    phones: { type: [String] },
    socialLinks: { type: btkCompanySocialLinkSchema },
    verificationStatus: {
      type: String,
      enum: ['pending', 'need_info', 'approved', 'rejected', 'violation'],
      default: 'pending',
    },
    coverImage: { type: String },
  }),
);
