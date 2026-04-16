import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const registrationFormSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    modifiedAt: { type: Date, label: 'Modified at' },
    membershipTypeId: {
      type: String,
      required: true,
      label: 'Membership type',
      index: true,
    },
    schemaVersion: {
      type: String,
      required: true,
      label: 'Schema version',
      index: true,
    },
    title: {
      type: String,
      required: true,
      label: 'Title',
    },
    description: {
      type: String,
      label: 'Description',
    },
    sections: {
      type: Schema.Types.Mixed,
      required: true,
      label: 'Sections',
    },
  },
  {
    timestamps: true,
  },
);

registrationFormSchema.index(
  { membershipTypeId: 1, schemaVersion: 1 },
  { unique: true },
);
