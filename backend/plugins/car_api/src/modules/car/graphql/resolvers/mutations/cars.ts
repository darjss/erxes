import type { Resolver } from 'erxes-api-shared/core-types';
import { IContext } from '~/connectionResolvers';
import { ICar, ICarDocument, ICarCategory } from '~/modules/car/@types/car';
import {
  CORE_COMPANY_CONTENT_TYPE,
  CORE_CUSTOMER_CONTENT_TYPE,
  ROOT_CAR_CONTENT_TYPE,
} from '~/modules/car/constants';
import { requireArrayResult, requireCoreTRPC } from '~/modules/car/core';

type CarResolver = Resolver<any, any, IContext>;

const ensureCarEntityRelation = async (
  subdomain: string,
  carId: string,
  relatedContentType: string,
  relatedContentId?: string,
) => {
  if (!relatedContentId) {
    return;
  }

  const existingIds = requireArrayResult<string>(
    await requireCoreTRPC({
      subdomain,
      module: 'relation',
      action: 'getRelationIds',
      input: {
        contentType: ROOT_CAR_CONTENT_TYPE,
        contentId: carId,
        relatedContentType,
      },
    }),
    'Core relation.getRelationIds',
  );

  if (existingIds.includes(relatedContentId)) {
    return;
  }

  return await requireCoreTRPC({
    subdomain,
    method: 'mutation',
    module: 'relation',
    action: 'createRelation',
    input: {
      relation: {
        entities: [
          {
            contentType: ROOT_CAR_CONTENT_TYPE,
            contentId: carId,
          },
          {
            contentType: relatedContentType,
            contentId: relatedContentId,
          },
        ],
      },
    },
  });
};

const hasCarEntityRelation = async (
  subdomain: string,
  carId: string,
  relatedContentType: string,
  relatedContentId?: string,
) => {
  if (!relatedContentId) {
    return false;
  }

  const existingIds = requireArrayResult<string>(
    await requireCoreTRPC({
      subdomain,
      module: 'relation',
      action: 'getRelationIds',
      input: {
        contentType: ROOT_CAR_CONTENT_TYPE,
        contentId: carId,
        relatedContentType,
      },
    }),
    'Core relation.getRelationIds',
  );

  return existingIds.includes(relatedContentId);
};

const canManageClientPortalCar = async (
  subdomain: string,
  carId: string,
  customerId?: string,
  companyId?: string,
) => {
  const [matchesCustomer, matchesCompany] = await Promise.all([
    hasCarEntityRelation(
      subdomain,
      carId,
      CORE_CUSTOMER_CONTENT_TYPE,
      customerId,
    ),
    hasCarEntityRelation(
      subdomain,
      carId,
      CORE_COMPANY_CONTENT_TYPE,
      companyId,
    ),
  ]);

  return matchesCustomer || matchesCompany;
};

const removeCarEntityRelations = async (
  subdomain: string,
  carIds: string[],
  relatedContentType: string,
  relatedContentId?: string,
) => {
  if (!relatedContentId || !carIds.length) {
    return;
  }

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

  const targetRelationIds = relations
    .filter((relation) =>
      relation.entities?.some(
        (entity) =>
          entity.contentType === relatedContentType &&
          entity.contentId === relatedContentId,
      ),
    )
    .map((relation) => relation._id);

  for (const relationId of targetRelationIds) {
    await requireCoreTRPC({
      subdomain,
      method: 'mutation',
      module: 'relation',
      action: 'deleteRelation',
      input: { _id: relationId },
    });
  }
};

export const carMutations: Record<string, CarResolver> = {
  async carsAdd(
    _root,
    doc: ICar,
    { models, user, __, checkPermission }: IContext,
  ) {
    await checkPermission('manageCars');

    return await models.Cars.createCar(__(doc), user);
  },

  async carsEdit(
    _root,
    { _id, ...doc }: { _id: string } & ICar,
    { models, __, checkPermission }: IContext,
  ) {
    await checkPermission('manageCars');

    return await models.Cars.updateCar(_id, __(doc));
  },

  async carsRemove(
    _root,
    { carIds = [] }: { carIds: string[] },
    { models, checkPermission }: IContext,
  ) {
    await checkPermission('manageCars');

    await models.Cars.removeCars(carIds);

    return carIds;
  },

  async carsMerge(
    _root,
    {
      carIds = [],
      carFields = {},
    }: { carIds: string[]; carFields: Partial<ICar> },
    { models, checkPermission }: IContext,
  ) {
    await checkPermission('manageCars');

    return await models.Cars.mergeCars(carIds, carFields);
  },

  async carCategoriesAdd(
    _root,
    doc: ICarCategory,
    { models, __, checkPermission }: IContext,
  ) {
    await checkPermission('manageCars');

    return await models.CarCategories.createCarCategory(__(doc));
  },

  async carCategoriesEdit(
    _root,
    { _id, ...doc }: { _id: string } & Partial<ICarCategory>,
    { models, __, checkPermission }: IContext,
  ) {
    await checkPermission('manageCars');

    return await models.CarCategories.updateCarCategory(_id, __(doc));
  },

  async carCategoriesRemove(
    _root,
    { _id }: { _id: string },
    { models, checkPermission }: IContext,
  ) {
    await checkPermission('manageCars');

    return await models.CarCategories.removeCarCategory(_id);
  },

  async cpCarsAdd(
    _root,
    {
      customerId,
      companyId,
      ...doc
    }: ICar & { customerId?: string; companyId?: string },
    { models, subdomain, user, __ }: IContext,
  ) {
    const carsOrFilter: Record<string, any>[] = [];

    if (doc.plateNumber) {
      carsOrFilter.push({ plateNumber: doc.plateNumber });
    }

    if (doc.vinNumber) {
      carsOrFilter.push({ vinNumber: doc.vinNumber });
    }

    if (!carsOrFilter.length) {
      throw new Error('Cant create, must fill plateNumber or vinNumber');
    }

    const existingCar = await models.Cars.findOne({
      status: { $ne: 'Deleted' },
      $or: carsOrFilter,
    }).lean();

    if (existingCar && !customerId && !companyId) {
      throw new Error(
        'Cant update this car, customerId or companyId is required',
      );
    }

    if (
      existingCar &&
      !(await canManageClientPortalCar(
        subdomain,
        existingCar._id,
        customerId,
        companyId,
      ))
    ) {
      throw new Error('Cant update this car, not a customer or company car');
    }

    const car = existingCar
      ? await models.Cars.updateCar(existingCar._id, __(doc))
      : await models.Cars.createCar(__(doc), user);

    await ensureCarEntityRelation(
      subdomain,
      car._id,
      CORE_CUSTOMER_CONTENT_TYPE,
      customerId,
    );

    await ensureCarEntityRelation(
      subdomain,
      car._id,
      CORE_COMPANY_CONTENT_TYPE,
      companyId,
    );

    return car;
  },

  async cpCarsEdit(
    _root,
    {
      _id,
      customerId,
      companyId,
      ...doc
    }: ICarDocument & { customerId?: string; companyId?: string },
    { models, subdomain, __ }: IContext,
  ) {
    if (!customerId && !companyId) {
      throw new Error(
        'Cant edit this car, customerId or companyId is required',
      );
    }

    const car = await models.Cars.getCar(_id);
    const canEdit = await canManageClientPortalCar(
      subdomain,
      car._id,
      customerId,
      companyId,
    );

    if (!canEdit) {
      throw new Error('Cant edit this car, not a customer or company car');
    }

    return await models.Cars.updateCar(_id, __(doc));
  },

  async cpCarsRemove(
    _root,
    {
      carIds = [],
      customerId,
      companyId,
    }: { carIds: string[]; customerId?: string; companyId?: string },
    { subdomain }: IContext,
  ) {
    await removeCarEntityRelations(
      subdomain,
      carIds,
      CORE_CUSTOMER_CONTENT_TYPE,
      customerId,
    );

    await removeCarEntityRelations(
      subdomain,
      carIds,
      CORE_COMPANY_CONTENT_TYPE,
      companyId,
    );

    return carIds;
  },
};

carMutations.cpCarsAdd.wrapperConfig = { forClientPortal: true };
carMutations.cpCarsEdit.wrapperConfig = { forClientPortal: true };
carMutations.cpCarsRemove.wrapperConfig = { forClientPortal: true };
