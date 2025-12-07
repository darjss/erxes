import { Schema } from 'mongoose';
import { ICVClientDocument, ICVClientContact } from '@/client/@types/client';

const contactSchema = new Schema<ICVClientContact>(
  {
    name: { type: String },
    position: { type: String },
    phone_number: { type: String },
    email: { type: String },
  },
  { _id: false },
);

export const cvClientSchema = new Schema<ICVClientDocument>(
  {
    name: { type: String, required: true },
    client_type: {
      type: String,
      required: true,
    },
    lead_source: {
      type: String,
    },
    registration_number: { type: String },
    operational_address: { type: String },
    business_type: {
      type: String,
    },
    business_category: { type: String },
    status: {
      type: String,
      required: true,
    },
    cvh_broker: { type: String },
    existing_insurance_policies: { type: String },
    claim_history_file: { type: String },
    description: { type: String },
    registered_date: { type: Date },
    isActive: { type: Boolean, default: true },
    bor_file: { type: String },
    service_agreement_file: { type: String },
    insurance_types: [{ type: String }],
    contacts: [contactSchema],
  },
  { timestamps: true },
);
