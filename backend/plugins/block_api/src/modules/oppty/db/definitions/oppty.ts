import { Schema } from 'mongoose';

export const opptySchema = new Schema({
  number: { type: String, required: true, label: 'Number' },
  description: { type: String, required: true, label: 'Description' },
  customerId: { type: String, required: true, label: 'Customer ID' },
  unitTypes: { type: [String], label: 'Unit Types' },
  units: { type: [String], label: 'Units' },
  unit: { type: String, required: false },
  assignedUserId: { type: String, label: 'Assigned User' },
  blocks: { type: [String], label: 'Blocks' },
  status: { type: String, required: true, label: 'Status' },
  labelIds: { type: [String], label: 'Label IDs' },
  tagIds: { type: [String], label: 'Tag IDs' },
  projectId: { type: String, label: 'Project ID' },
  customerSource: { type: String, label: 'Customer Source' },
});
