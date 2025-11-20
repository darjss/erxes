import { Schema } from 'mongoose';
import { schemaWrapper } from '~/utils';

export const btkNewsMemberSchema = schemaWrapper(
  new Schema({
    memberId: { type: String, label: 'Member ID' },
    news: {
      type: Schema.Types.ObjectId,
      label: 'News ID',
      ref: 'btk_news',
    },
    role: { type: String, label: 'Role' },
  }),
);
