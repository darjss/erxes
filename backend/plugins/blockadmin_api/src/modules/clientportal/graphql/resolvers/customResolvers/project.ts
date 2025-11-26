import { IContext } from '~/connectionResolvers';
import { IProjectDocument } from '~/modules/project/@types/project';
import { projectSchema } from '~/modules/project/db/definitions/project';

export default {
  counts: async (
    { _id, counts }: IProjectDocument,
    _args: any,
    { models }: IContext,
  ) => {
    const buildings = await models.Building.distinct('_id', {
      project: _id,
    });

    const zones = await models.Zoning.distinct('_id', {
      building: { $in: buildings },
    });

    const units = await models.Unit.distinct('_id', {
      zoning: { $in: zones },
    });

    return {
      buildings: counts?.buildings || buildings.length,
      units: counts?.units || units.length,
      zones: counts?.zones || zones.length,
      parking: counts?.parking,
    };
  },
  priceRanges: async ({ prices }: IProjectDocument) => {
    if (!prices || prices.length === 0) {
      return {};
    }

    const ranges = {};

    for (const item of prices) {
      const key = `${item.currency}_${item.priceType}`;

      if (!ranges[key]) {
        ranges[key] = {
          min: item.price,
          max: item.price,
        };
      } else {
        ranges[key].min = Math.min(ranges[key].min, item.price);
        ranges[key].max = Math.max(ranges[key].max, item.price);
      }
    }

    return ranges;
  },
  progress: async (project: IProjectDocument) => {
    const fields = Object.keys(projectSchema.obj);
    let completedFields = 0;

    for (const field of fields) {
      const value = project[field];

      if (value === undefined || value === null || value === '') {
        continue;
      }

      if (Array.isArray(value) && !value.length) {
        continue;
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        continue;
      }

      completedFields++;
    }

    return ((completedFields / fields.length) * 100).toFixed(2);
  },
};
