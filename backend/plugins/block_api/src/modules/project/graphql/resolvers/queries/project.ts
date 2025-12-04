import { requireLogin } from 'erxes-api-shared/core-modules';
import isNil from 'lodash/isNil';
import { FilterQuery } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import {
  IProject,
  IProjectFilterParams,
} from '~/modules/project/@types/project';

const generateFilter = (filters: IProjectFilterParams) => {
  const { searchValue, dateFilters, types, status, isPublished, locations } =
    filters || {};

  const query: FilterQuery<IProject> = {};

  if (searchValue) {
    query.$or = [{ name: { $regex: searchValue, $options: 'i' } }];
  }

  if (dateFilters) {
    const dateFilter = JSON.parse(dateFilters);

    for (const key in dateFilter) {
      if (dateFilter.hasOwnProperty(key)) {
        const { gte, lte } = dateFilter[key];

        if (!query[key]) {
          query[key] = {};
        }

        if (gte) {
          query[key]['$gte'] = gte;
        }

        if (lte) {
          query[key]['$lte'] = lte;
        }
      }
    }
  }

  if (types?.length) {
    query.types = { $in: types };
  }

  if (status) {
    query.status = status;
  }

  if (!isNil(isPublished)) {
    query.isPublished = isPublished;
  }

  if (locations) {
    const location = JSON.parse(locations);

    if (location.city) {
      query['location.city'] = location.city;
    }

    if (location.district) {
      query['location.district'] = location.district;
    }
  }

  return query;
};

export const projectQueries = {
  blockGetProject: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return models.Project.getProject(_id);
  },

  blockGetProjects: async (
    _parent: undefined,
    { filters }: { filters: IProjectFilterParams },
    { models }: IContext,
  ) => {
    const query = generateFilter(filters);

    return models.Project.find(query).lean();
  },
};

requireLogin(projectQueries, 'blockGetProject');
requireLogin(projectQueries, 'blockGetProjects');
