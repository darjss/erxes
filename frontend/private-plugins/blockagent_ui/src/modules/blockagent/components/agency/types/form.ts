import { z } from 'zod';
import {
  // Agency
  agencyIdentitySchema,
  agencyBasicInformationSchema,
  agencyIntroductionSchema,
  agencyDocuments,
  agencyFieldsOfExpertiseSchema,
  agencyOperationAreasSchema,
  agencySocialLinksSchema,
  verificationStatusSchema,
} from '../schema/form';
import { socialPlatforms } from '../constants/social-platforms';

// ─── Agency profile ───────────────────────────────────────────────────────────

export type SocialPlatform = (typeof socialPlatforms)[number];

export type AgencyIdentityValues = z.infer<typeof agencyIdentitySchema>;

export type AgencyBasicInformationValues = z.infer<
  typeof agencyBasicInformationSchema
>;

export type AgencyIntroductionValues = z.infer<typeof agencyIntroductionSchema>;

export type AgencyDocumentsValues = z.infer<typeof agencyDocuments>;

export type AgencyFieldsOfExpertiseValues = z.infer<
  typeof agencyFieldsOfExpertiseSchema
>;

export type AgencyOperationAreasValues = z.infer<
  typeof agencyOperationAreasSchema
>;

export type AgencySocialLinksValues = z.infer<typeof agencySocialLinksSchema>;

/** Combined agency profile form values */
export type AgencyProfileFormValues = AgencyIdentityValues &
  AgencyBasicInformationValues &
  AgencyIntroductionValues &
  AgencyDocumentsValues &
  AgencyFieldsOfExpertiseValues &
  AgencyOperationAreasValues &
  AgencySocialLinksValues;

export type VerificationValues = z.infer<typeof verificationStatusSchema>;
