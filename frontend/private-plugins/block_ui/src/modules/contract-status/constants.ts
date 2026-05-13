import {
  IconBookmark,
  IconFileText,
  IconFileCheck,
  IconCircleX,
  IconAlertTriangle,
} from '@tabler/icons-react';

export const BlockContractStatusIcons: Record<string, any> = {
  reserved: IconBookmark,
  draft: IconFileText,
  signed: IconFileCheck,
  cancelled: IconCircleX,
  lost: IconAlertTriangle,
};

export const TERMINAL_CONTRACT_STATUS_TYPES = [
  'lost',
  'cancelled',
];
