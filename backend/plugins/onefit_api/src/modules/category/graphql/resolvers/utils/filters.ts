import { escapeRegExp } from 'erxes-api-shared/utils';
import { ICategoryQueryParams } from '../queries/category';

export function generateFilter(params: ICategoryQueryParams) {
  const filter: any = {};
  const orConditions: any[] = [];

  if (params.searchValue) {
    const searchRegex = {
      $regex: `.*${escapeRegExp(params.searchValue)}.*`,
      $options: 'i',
    };
    orConditions.push(
      { 'name.en': searchRegex },
      { 'name.mn': searchRegex },
      { 'description.en': searchRegex },
      { 'description.mn': searchRegex },
    );
  }

  if (params.name) {
    orConditions.push({ 'name.en': params.name }, { 'name.mn': params.name });
  }

  if (orConditions.length > 0) {
    filter.$or = orConditions;
  }

  if (params.parentId !== undefined) {
    if (params.parentId === null || params.parentId === '') {
      const parentIdOr = [
        { parentId: { $exists: false } },
        { parentId: null },
        { parentId: '' },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: parentIdOr }];
        delete filter.$or;
      } else {
        filter.$or = parentIdOr;
      }
    } else {
      filter.parentId = params.parentId;
    }
  }

  if (params.isActive !== undefined) {
    filter.isActive = params.isActive;
  }

  return filter;
}
