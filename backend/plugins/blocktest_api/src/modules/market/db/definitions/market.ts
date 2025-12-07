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
      default: false,
    },
    business_partner_questionnaire_received: {
      type: Boolean,
      label: 'Business Partner Questionnaire Received',
      default: false,
    },
    certificate_of_incorporation_sent: {
      type: Boolean,
      label: 'Certificate of Incorporation Sent',
      default: false,
    },
    certificate_of_incorporation_received: {
      type: Boolean,
      label: 'Certificate of Incorporation Received',
      default: false,
    },
    business_license_sent: { type: Boolean, label: 'Business License Sent' },
    business_license_received: {
      type: Boolean,
      label: 'Business License Received',
      default: false,
    },
    audited_financial_reports_sent: {
      type: Boolean,
      label: 'Audited Financial Reports Sent',
      default: false,
    },
    audited_financial_reports_received: {
      type: Boolean,
      label: 'Audited Financial Reports Received',
      default: false,
    },
    ownership_chart_sent: { type: Boolean, label: 'Ownership Chart Sent' },
    ownership_chart_received: {
      type: Boolean,
      label: 'Ownership Chart Received',
      default: false,
    },
    compliance_policies_sent: {
      type: Boolean,
      label: 'Compliance Policies Sent',
      default: false,
    },
    compliance_policies_received: {
      type: Boolean,
      label: 'Compliance Policies Received',
      default: false,
    },
    tob_sent: { type: Boolean, label: 'TOB Sent', default: false },
    tob_received: { type: Boolean, label: 'TOB Received', default: false },
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
