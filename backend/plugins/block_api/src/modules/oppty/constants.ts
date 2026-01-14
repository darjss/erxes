export const OPPTY_STATUSES = {
  NEW_LEAD_UNASSIGNED: 'new_lead_unassigned',
  ASSIGNED_IN_CONTACT: 'assigned_in_contact',
  QUALIFIED_LEAD: 'qualified_lead',
  UNIT_SHORTLIST_CREATED: 'unit_shortlist_created',
  PROPERTY_VIEWING: 'property_viewing',
  UNIT_SELECTED: 'unit_selected',
  NEGOTIATION: 'negotiation',
  RESERVATION: 'reservation',
  CONTRACT_DRAFTING_SIGNING: 'contract_drafting_signing',
  CLOSED_SUCCESSFUL: 'closed_successful',
  CLOSED_UNSUCCESSFUL: 'closed_unsuccessful',
  CANCELLED: 'cancelled',
} as const;

export const OPPTY_CUSTOMER_SOURCES = {
  WEBSITE: 'website',
  PHONE: 'phone',
  EMAIL: 'email',
  SOCIAL_MEDIA: 'social_media',
  FORM: 'form',
  SALES_MANAGER: 'sales_manager',
  OTHER: 'other',
} as const;

export const OPPTY_FIELDS = {
  customer: 'CUSTOMER',
  number: 'NUMBER',
  customerSource: 'CUSTOMER_SOURCE',
  assignedUserId: 'ASSIGNED_USER',
  blocks: 'BLOCK',
  status: 'STATUS',
  labelIds: 'LABEL',
  tagIds: 'TAG',
  projectId: 'PROJECT',
  unitType: 'UNIT_TYPE',
  units: 'UNIT',
  startDate: 'START_DATE',
  targetDate: 'TARGET_DATE',
};
