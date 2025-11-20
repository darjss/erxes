import { Schema } from 'mongoose';

export const btkNewsMemberSchema = new Schema({
  memberId: { type: String, label: 'Member ID' },
  news: {
    type: Schema.Types.ObjectId,
    label: 'News ID',
    ref: 'btk_news',
  },
  role: { type: String, label: 'Role' },
});
