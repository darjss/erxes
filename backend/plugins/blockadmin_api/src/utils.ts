import { Schema } from 'mongoose';

export const schemaWrapper = (schema: Schema) => {
  schema.add({
    subdomain: { type: String, index: true },
    entityId: { type: String, index: true },
  });

  schema.index({ subdomain: 1, entityId: 1 }, { unique: true });

  return schema;
};
