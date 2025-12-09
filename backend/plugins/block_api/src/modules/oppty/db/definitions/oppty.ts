import { Schema } from 'mongoose';

export const opptySchema = new Schema({
  number: { type: String, required: true },
  description: { type: String, required: true },
  customerId: { type: String, required: true },
  unitTypes: { type: [String], required: false },
  units: { type: [String], required: false },
  assignedUserId: { type: String, required: false },
  status: { type: String, required: true },
  labelIds: { type: [String], required: false },
  tagIds: { type: [String], required: false },
  projectId: { type: String, required: false },
});
