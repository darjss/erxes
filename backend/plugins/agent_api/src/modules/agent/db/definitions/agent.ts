import { Schema } from 'mongoose';

import { schemaWrapper } from 'erxes-api-shared/utils';
import { SERVER_STATUSES } from '../../constants';

export const agentServerSchema = schemaWrapper(
  new Schema(
    {
      name: { type: String, label: 'Name' },
      url: { type: String, label: 'Url' },
      token: { type: String, label: 'Token' },
      approveCode: { type: String, label: 'Approve code' },

      agentId: { type: String, label: 'Agent name' },
      serverId: { type: String, label: 'Server ID' },

      status: { type: String, enum: SERVER_STATUSES.ALL, label: 'Status' },
    },
    {
      timestamps: true,
    },
  ),
);
