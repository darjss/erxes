import { capitalize } from 'lodash';

export const ORDER_GAP = 1000;

export const DEFAULT_STATUS_TYPES = {
  LEAD: 'lead',
  QUALIFIED: 'qualified',
  MATCHING: 'matching',
  NEGOTIATION: 'negotiation',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost',
};

export const DEFAULT_STATUSES = {
  [DEFAULT_STATUS_TYPES.LEAD]: {
    NEW: { name: 'New', color: '#FF6B6B', type: DEFAULT_STATUS_TYPES.LEAD },
    CONTACTED: {
      name: 'Contacted',
      color: '#4ECDC4',
      type: DEFAULT_STATUS_TYPES.LEAD,
    },
  },
  [DEFAULT_STATUS_TYPES.QUALIFIED]: {
    QUALIFIED: {
      name: 'Qualified',
      color: '#45B7D1',
      type: DEFAULT_STATUS_TYPES.QUALIFIED,
    },
  },
  [DEFAULT_STATUS_TYPES.MATCHING]: {
    SUGGESTED: {
      name: 'Suggested',
      color: '#96CEB4',
      type: DEFAULT_STATUS_TYPES.MATCHING,
    },
    VIEWED: {
      name: 'Viewed',
      color: '#FFEAA7',
      type: DEFAULT_STATUS_TYPES.MATCHING,
    },
  },
  [DEFAULT_STATUS_TYPES.NEGOTIATION]: {
    NEGOTIATION: {
      name: 'Negotiation',
      color: '#DDA0DD',
      type: DEFAULT_STATUS_TYPES.NEGOTIATION,
    },
    RESERVED: {
      name: 'Reserved',
      color: '#FF6B6B',
      type: DEFAULT_STATUS_TYPES.NEGOTIATION,
    },
  },
  [DEFAULT_STATUS_TYPES.CLOSED_WON]: {
    COMPLETED: {
      name: 'Completed',
      color: '#4ECDC4',
      type: DEFAULT_STATUS_TYPES.CLOSED_WON,
    },
  },
  [DEFAULT_STATUS_TYPES.CLOSED_LOST]: {
    LOST: {
      name: 'Lost',
      color: '#45B7D1',
      type: DEFAULT_STATUS_TYPES.CLOSED_LOST,
    },
  },
};

export const DEFAULT_STATUS_TYPE_VALUES = {
  [DEFAULT_STATUS_TYPES.LEAD]: {
    color: '#FF6B6B',
    type: '',
    name: capitalize(DEFAULT_STATUS_TYPES.LEAD),
  },
  [DEFAULT_STATUS_TYPES.QUALIFIED]: {
    color: '#4ECDC4',
    type: '',
    name: capitalize(DEFAULT_STATUS_TYPES.QUALIFIED),
  },
  [DEFAULT_STATUS_TYPES.MATCHING]: {
    color: '#45B7D1',
    type: '',
    name: capitalize(DEFAULT_STATUS_TYPES.MATCHING),
  },
  [DEFAULT_STATUS_TYPES.NEGOTIATION]: {
    color: '#96CEB4',
    type: '',
    name: capitalize(DEFAULT_STATUS_TYPES.NEGOTIATION),
  },
  [DEFAULT_STATUS_TYPES.CLOSED_WON]: {
    color: '#FFEAA7',
    type: '',
    name: capitalize(DEFAULT_STATUS_TYPES.CLOSED_WON),
  },
  [DEFAULT_STATUS_TYPES.CLOSED_LOST]: {
    color: '#DDA0DD',
    type: '',
    name: capitalize(DEFAULT_STATUS_TYPES.CLOSED_LOST),
  },
};
