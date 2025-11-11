import { Schema } from 'mongoose';
import { schemaWrapper } from '~/utils';

export const blockProjectMemberSchema = schemaWrapper(
  new Schema({
    memberId: { type: String, label: 'Member ID' },
    project: {
      type: Schema.Types.ObjectId,
      label: 'Project ID',
      ref: 'block_projects',
    },
    role: { type: String, label: 'Role' },
  }),
);
