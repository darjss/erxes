import { Schema } from 'mongoose';
import { CVMarketContact } from '@/market/@types/market';

const cvMarketContactSchema = new Schema<CVMarketContact>(
  {
    name: { type: String },
    position: { type: String },
    phone_number: { type: String },
    email: { type: String },
  },
  { _id: false },
);

export const cvMarketSchema = new Schema(
  {
    name: { type: String, label: 'Name' },
    description: { type: String, label: 'Description' },
    registration_number: { type: String, label: 'Registration Number' },
    operational_address: { type: String, label: 'Operational Address' },
    type: { type: String, label: 'Type' },
    specialization: { type: String, label: 'Specialization' },
    region: { type: String, label: 'Region' },
    country: { type: String, label: 'Country' },
    onboarded: { type: Boolean, label: 'Onboarded' },
    onboarded_date: { type: Date, label: 'Onboarded Date' },
    onboarding_status: { type: String, label: 'Onboarding Status' },
    business_partner_questionnaire_sent: {
      type: Boolean,
      label: 'Business Partner Questionnaire Sent',
    },
    business_partner_questionnaire_received: {
      type: Boolean,
      label: 'Business Partner Questionnaire Received',
    },
    certificate_of_incorporation_sent: {
      type: Boolean,
      label: 'Certificate of Incorporation Sent',
    },
    certificate_of_incorporation_received: {
      type: Boolean,
      label: 'Certificate of Incorporation Received',
    },
    business_license_sent: { type: Boolean, label: 'Business License Sent' },
    business_license_received: {
      type: Boolean,
      label: 'Business License Received',
    },
    audited_financial_reports_sent: {
      type: Boolean,
      label: 'Audited Financial Reports Sent',
    },
    audited_financial_reports_received: {
      type: Boolean,
      label: 'Audited Financial Reports Received',
    },
    ownership_chart_sent: { type: Boolean, label: 'Ownership Chart Sent' },
    ownership_chart_received: {
      type: Boolean,
      label: 'Ownership Chart Received',
    },
    compliance_policies_sent: {
      type: Boolean,
      label: 'Compliance Policies Sent',
    },
    compliance_policies_received: {
      type: Boolean,
      label: 'Compliance Policies Received',
    },
    tob_sent: { type: Boolean, label: 'TOB Sent' },
    tob_received: { type: Boolean, label: 'TOB Received' },
    contacts: { type: [cvMarketContactSchema], label: 'Contacts' },
    claim_handling_contact: {
      type: cvMarketContactSchema,
      label: 'Claim Handling Contact',
    },
  },
  {
    timestamps: true,
  },
);
