import { attachmentSchema } from 'erxes-api-shared/core-modules';
import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import { CAR_SELECT_OPTIONS } from '../../constants';

const getEnumValues = (values: ReadonlyArray<{ value: string }>) =>
  values.map((option) => option.value);

export const carCustomFieldSchema = new Schema(
  {
    field: { type: String, label: 'Field' },
    value: { type: Schema.Types.Mixed, label: 'Value' },
    stringValue: { type: String, optional: true, label: 'String value' },
    numberValue: { type: Number, optional: true, label: 'Number value' },
    dateValue: { type: Date, optional: true, label: 'Date value' },
    locationValue: {
      type: {
        type: String,
        enum: ['Point'],
        optional: true,
      },
      coordinates: {
        type: [Number],
        optional: true,
      },
    },
  },
  { _id: false },
);

carCustomFieldSchema.index({ locationValue: '2dsphere' });

export const carCategorySchema = schemaWrapper(
  new Schema({
    _id: mongooseStringRandomId,
    name: { type: String, label: 'Name' },
    code: { type: String, unique: true, label: 'Code' },
    order: { type: String, label: 'Order' },
    parentId: { type: String, optional: true, label: 'Parent' },
    description: { type: String, optional: true, label: 'Description' },
    image: { type: attachmentSchema, optional: true, label: 'Image' },
    secondaryImages: {
      type: [attachmentSchema],
      optional: true,
      label: 'Secondary images',
    },
    productCategoryId: {
      type: String,
      optional: true,
      label: 'Product category',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      label: 'Created at',
    },
  }),
);

export const carSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      ownerId: { type: String, optional: true, label: 'Owner' },
      mergedIds: {
        type: [String],
        optional: true,
        default: [],
        label: 'Merged ids',
      },
      description: { type: String, optional: true, label: 'Description' },
      tagIds: {
        type: [String],
        optional: true,
        default: [],
        label: 'Tags',
      },
      plateNumber: {
        type: String,
        optional: true,
        index: true,
        label: 'Plate number',
      },
      vinNumber: {
        type: String,
        optional: true,
        index: true,
        label: 'VIN number',
      },
      colorCode: { type: String, optional: true, label: 'Color code' },
      categoryId: {
        type: String,
        optional: true,
        index: true,
        label: 'Category',
      },
      bodyType: {
        type: String,
        optional: true,
        default: '',
        enum: getEnumValues(CAR_SELECT_OPTIONS.BODY_TYPES),
        label: 'Body type',
        selectOptions: CAR_SELECT_OPTIONS.BODY_TYPES,
      },
      fuelType: {
        type: String,
        optional: true,
        default: '',
        enum: getEnumValues(CAR_SELECT_OPTIONS.FUEL_TYPES),
        label: 'Fuel type',
        selectOptions: CAR_SELECT_OPTIONS.FUEL_TYPES,
      },
      gearBox: {
        type: String,
        optional: true,
        default: '',
        enum: getEnumValues(CAR_SELECT_OPTIONS.GEAR_BOXES),
        label: 'Gear box',
        selectOptions: CAR_SELECT_OPTIONS.GEAR_BOXES,
      },
      vintageYear: {
        type: Number,
        default: new Date().getFullYear(),
        label: 'Vintage year',
      },
      importYear: {
        type: Number,
        default: new Date().getFullYear(),
        label: 'Import year',
      },
      status: {
        type: String,
        optional: true,
        default: 'Active',
        enum: getEnumValues(CAR_SELECT_OPTIONS.STATUSES),
        index: true,
        label: 'Status',
        selectOptions: CAR_SELECT_OPTIONS.STATUSES,
      },
      attachment: {
        type: attachmentSchema,
        optional: true,
        label: 'Attachment',
      },
      customFieldsData: {
        type: [carCustomFieldSchema],
        optional: true,
        default: [],
        label: 'Custom fields data',
      },
      searchText: {
        type: String,
        optional: true,
        index: true,
        label: 'Search text',
      },
    },
    {
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'modifiedAt',
      },
    },
  ),
);
