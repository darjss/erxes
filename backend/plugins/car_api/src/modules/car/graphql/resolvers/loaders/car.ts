import DataLoader from 'dataloader';
import { IModels } from '~/connectionResolvers';
import {
  CORE_COMPANY_CONTENT_TYPE,
  CORE_CUSTOMER_CONTENT_TYPE,
  ROOT_CAR_CONTENT_TYPE,
} from '~/modules/car/constants';
import { requireArrayResult, requireCoreTRPC } from '~/modules/car/core';

export interface IRef {
  __typename: string;
  _id: string;
}

const buildRelationLoader = (
  subdomain: string,
  relatedContentType: string,
  typename: string,
) =>
  new DataLoader<string, IRef[]>(async (carIds) => {
    const relations = requireArrayResult<any>(
      await requireCoreTRPC({
        subdomain,
        module: 'relation',
        action: 'filterRelations',
        input: {
          contentType: ROOT_CAR_CONTENT_TYPE,
          contentIds: carIds,
          relatedContentType,
        },
      }),
      'Core relation.filterRelations',
    );

    const refsByCarId: Record<string, IRef[]> = {};

    for (const relation of relations) {
      const carId =
        relation.entities?.find(
          (entity) => entity.contentType === ROOT_CAR_CONTENT_TYPE,
        )?.contentId || '';
      const relatedId =
        relation.entities?.find(
          (entity) => entity.contentType === relatedContentType,
        )?.contentId || '';

      if (!refsByCarId[carId]) {
        refsByCarId[carId] = [];
      }

      if (relatedId) {
        refsByCarId[carId].push({
          __typename: typename,
          _id: relatedId,
        });
      }
    }

    return carIds.map((carId) => refsByCarId[carId] || []);
  });

export const carLoader = (subdomain: string, models: IModels) => ({
  customersByCarId: buildRelationLoader(
    subdomain,
    CORE_CUSTOMER_CONTENT_TYPE,
    'Customer',
  ),
  companiesByCarId: buildRelationLoader(
    subdomain,
    CORE_COMPANY_CONTENT_TYPE,
    'Company',
  ),
  categoryById: new DataLoader<string, any>(async (categoryIds) => {
    const categories = await models.CarCategories.find({
      _id: { $in: categoryIds },
    }).lean();

    const categoryById = Object.fromEntries(
      categories.map((category) => [category._id, category]),
    );

    return categoryIds.map((categoryId) => categoryById[categoryId] || null);
  }),
});
