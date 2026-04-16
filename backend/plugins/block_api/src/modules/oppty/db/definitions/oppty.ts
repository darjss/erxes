import { Schema } from 'mongoose';

export const opptySchema = new Schema(
  {
    number: { type: String, label: 'Number' },
    description: { type: String, required: true, label: 'Description' },
    customerId: { type: String, required: true, label: 'Customer ID' },
    unitType: { type: Schema.Types.ObjectId, label: 'Unit Type' },
    tenureType: { type: String, label: 'Tenure Type' },
    units: { type: [Schema.Types.ObjectId], label: 'Units' },
    unit: { type: Schema.Types.ObjectId, required: false },
    propertyRows: {
      type: [
        {
          buildingId: { type: String },
          zoningId: { type: String },
          unitId: { type: String },
          isMain: { type: Boolean, default: false },
        },
      ],
      default: [],
      label: 'Property Rows',
    },
    assignedUserId: { type: String, label: 'Assigned User' },
    blocks: { type: [String], label: 'Blocks' },
    status: { type: Schema.Types.ObjectId, required: true, label: 'Status' },
    labelIds: { type: [String], label: 'Label IDs' },
    tagIds: { type: [String], label: 'Tag IDs' },
    projectId: { type: Schema.Types.ObjectId, label: 'Project ID' },
    customerSource: { type: String, label: 'Customer Source' },
    priority: { type: String, label: 'Priority' },
    startDate: { type: Date, label: 'Start Date' },
    targetDate: { type: Date, label: 'Target Date' },
    propertiesData: {
      type: Schema.Types.Mixed,
      optional: true,
      label: 'Properties data',
    },
  },
  { timestamps: true },
);
