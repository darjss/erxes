import { splitType } from 'erxes-api-shared/core-modules';
import { escapeRegExp, validSearchText } from 'erxes-api-shared/utils';
import {
  CAR_SEGMENT_CONTENT_TYPE,
  CORE_COMPANY_CONTENT_TYPE,
  CORE_CUSTOMER_CONTENT_TYPE,
  ROOT_CAR_CONTENT_TYPE,
} from './constants';
import { ICar } from './@types/car';

export const buildCarSearchText = (doc: Partial<ICar>) =>
  validSearchText([
    doc.plateNumber || '',
    doc.vinNumber || '',
    doc.description || '',
    doc.categoryId || '',
    doc.colorCode || '',
  ]);

export const getCarDisplayName = (car: Partial<ICar>) =>
  car.plateNumber || car.vinNumber || 'Unknown car';

export const buildSearchRegex = (searchValue: string) =>
  new RegExp(escapeRegExp(searchValue), 'i');

export const isDeletedStatus = (status?: string) => status === 'Deleted';

export const getActiveCarsSelector = () => ({
  status: { $ne: 'Deleted' },
});

export const normalizeRelationContentType = (value?: string) => {
  if (!value) {
    return value;
  }

  const directMap: Record<string, string> = {
    car: ROOT_CAR_CONTENT_TYPE,
    cars: ROOT_CAR_CONTENT_TYPE,
    customer: CORE_CUSTOMER_CONTENT_TYPE,
    company: CORE_COMPANY_CONTENT_TYPE,
    deal: 'sales:deal',
    task: 'operation:task',
    ticket: 'frontline:ticket',
    conversation: 'frontline:conversation',
    product: 'core:product',
  };

  if (directMap[value]) {
    return directMap[value];
  }

  if (value.includes('.')) {
    const [pluginName, moduleName, collectionType] = splitType(value);

    if (!pluginName) {
      return value;
    }

    return `${pluginName}:${collectionType || moduleName}`;
  }

  if (value.includes(':')) {
    const [pluginName, moduleName, collectionType] = splitType(value);

    if (!pluginName) {
      return value;
    }

    return `${pluginName}:${collectionType || moduleName}`;
  }

  return value;
};

export const extractMergeRelations = (
  relations: Array<{
    entities?: Array<{ contentType: string; contentId: string }>;
  }>,
  sourceCarIds: string[],
) => {
  const relationMap = new Map<
    string,
    { contentType: string; contentId: string }
  >();

  for (const relation of relations) {
    for (const entity of relation.entities || []) {
      if (!entity?.contentType || !entity?.contentId) {
        continue;
      }

      if (
        entity.contentType === ROOT_CAR_CONTENT_TYPE ||
        sourceCarIds.includes(entity.contentId)
      ) {
        continue;
      }

      relationMap.set(`${entity.contentType}:${entity.contentId}`, entity);
    }
  }

  return Array.from(relationMap.values());
};

export const getCarSegmentContentType = () => CAR_SEGMENT_CONTENT_TYPE;
