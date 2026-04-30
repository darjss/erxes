import {
  createCoreModuleProducerHandler,
  gatherAssociatedTypes,
  SegmentConfigs,
  splitType,
  TSegmentProducers,
} from 'erxes-api-shared/core-modules';
import {
  fetchByQueryWithScroll,
  getEsIndexByContentType,
} from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolvers';
import {
  requireArrayResult,
  requireCoreTRPC,
  requireTRPC,
} from '~/modules/car/core';
import { normalizeRelationContentType } from '~/modules/car/utils';

const carSegments = {
  associationFilter: async (
    {
      mainType,
      propertyType,
      positiveQuery,
      negativeQuery,
    }: {
      mainType: string;
      propertyType: string;
      positiveQuery: any;
      negativeQuery: any;
    },
    { subdomain },
  ) => {
    const associatedTypes = await gatherAssociatedTypes(mainType);

    if (associatedTypes.includes(propertyType)) {
      const mainTypeIds = await fetchByQueryWithScroll({
        subdomain,
        index: await getEsIndexByContentType(propertyType),
        positiveQuery,
        negativeQuery,
      });

      return requireArrayResult<string>(
        await requireCoreTRPC({
          subdomain,
          module: 'relation',
          action: 'filterRelationIds',
          input: {
            contentType: normalizeRelationContentType(propertyType),
            contentIds: mainTypeIds,
            relatedContentType: normalizeRelationContentType(mainType),
          },
        }),
        'Core relation.filterRelationIds',
      );
    }

    const [pluginName] = splitType(propertyType);

    if (!pluginName || pluginName === 'car') {
      return [];
    }

    return requireArrayResult<string>(
      await requireTRPC({
        subdomain,
        pluginName,
        module: 'segments',
        action: 'associationFilter',
        input: {
          mainType,
          propertyType,
          positiveQuery,
          negativeQuery,
        },
      }),
      `${pluginName} segments.associationFilter`,
    );
  },

  initialSelector: async () => {
    return {
      data: {
        negative: {
          term: {
            status: 'Deleted',
          },
        },
      },
      status: 'success',
    };
  },

  esTypesMap: async () => {
    return { data: { typesMap: {} }, status: 'success' };
  },
};

const modules = {
  car: carSegments,
};

export default {
  dependentModules: [
    {
      name: 'core',
      types: ['company', 'customer'],
      twoWay: true,
      associated: true,
    },
    {
      name: 'sales',
      types: ['deal'],
      twoWay: true,
      associated: true,
    },
    {
      name: 'operation',
      types: ['task'],
      twoWay: true,
      associated: true,
    },
    {
      name: 'frontline',
      types: ['conversation', 'ticket'],
      twoWay: true,
      associated: true,
    },
  ],
  contentTypes: [
    {
      moduleName: 'car',
      type: 'car',
      description: 'Car',
      esIndex: 'cars',
    },
  ],
  associationFilter: createCoreModuleProducerHandler({
    moduleName: 'segments',
    modules,
    methodName: TSegmentProducers.ASSOCIATION_FILTER,
    extractModuleName: (input) => splitType(input.mainType)[1],
    generateModels,
  }),
  initialSelector: createCoreModuleProducerHandler({
    moduleName: 'segments',
    modules,
    methodName: TSegmentProducers.INITIAL_SELECTOR,
    extractModuleName: (input) => splitType(input.segment.contentType)[1],
    generateModels,
  }),
  esTypesMap: createCoreModuleProducerHandler({
    moduleName: 'segments',
    modules,
    methodName: TSegmentProducers.ES_TYPES_MAP,
    extractModuleName: (input) => input.collectionType,
    generateModels,
  }),
} as SegmentConfigs;
