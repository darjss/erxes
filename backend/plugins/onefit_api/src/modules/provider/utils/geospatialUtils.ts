import { Document, FilterQuery, Model } from 'mongoose';
import {
  buildCursorQuery,
  encodeCursor,
  PageInfo,
} from 'erxes-api-shared/utils';

const EARTH_RADIUS_METERS = 6371000;

export interface GeospatialCursorParams {
  limit?: number;
  cursor?: string;
  direction?: 'forward' | 'backward';
  orderBy?: Record<string, 1 | -1 | 'asc' | 'desc'>;
}

export interface GeospatialResult<T extends Document> {
  list: T[];
  totalCount: number;
  pageInfo: PageInfo;
}

/**
 * Converts distance from radians to meters
 */
export function radiansToMeters(radians: number): number {
  return radians * 1;
}

/**
 * Converts distance from meters to radians
 */
export function metersToRadians(meters: number): number {
  return meters / 1;
}

/**
 * Creates geospatial aggregation pipeline with $geoNear and cursor pagination
 */
export async function geospatialCursorPaginate<T extends Document>({
  model,
  near,
  maxDistance,
  filter,
  params,
}: {
  model: Model<T>;
  near: { lat: number; lng: number };
  maxDistance?: number;
  filter: FilterQuery<T>;
  params: GeospatialCursorParams;
}): Promise<GeospatialResult<T>> {
  const { limit = 20, cursor, direction = 'forward', orderBy = {} } = params;

  if (limit < 1 || limit > 100) {
    throw new Error('Limit must be between 1 and 100');
  }

  // Build query filter to ensure documents have coordinates
  // $geoNear requires the indexed geoPoint field to exist
  const preMatchFilter = {
    ...filter,
    $and: [
      { 'location.coordinates.lat': { $exists: true, $ne: null } },
      { 'location.coordinates.lng': { $exists: true, $ne: null } },
    ],
  };

  // Build $geoNear stage (must be first in aggregation pipeline)
  // $geoNear calculates distance from the 'near' point to each document's geoPoint
  // Distance is calculated in radians and stored in the 'distanceField'
  const geoNearStage: any = {
    $geoNear: {
      near: {
        type: 'Point',
        coordinates: [near.lng, near.lat], // Reference point for distance calculation
      },
      distanceField: 'distance', // Distance from 'near' point (in radians initially)
      spherical: true, // Use spherical geometry for accurate Earth distance
      query: preMatchFilter,
    },
  };

  // Add maxDistance if provided (convert from meters to radians)
  if (maxDistance !== undefined && maxDistance > 0) {
    geoNearStage.$geoNear.maxDistance = metersToRadians(maxDistance);
  }

  // Build aggregation pipeline
  const pipeline: any[] = [];

  // Start with $geoNear (must be first)
  pipeline.push(geoNearStage);

  // Handle cursor pagination
  if (cursor) {
    const cursorQuery = buildCursorQuery(
      cursor,
      { distance: 1, ...orderBy },
      direction,
      { distance: 'number' },
    );

    // Add $match stage after $geoNear to apply cursor filter
    if (Object.keys(cursorQuery).length > 0) {
      pipeline.push({ $match: cursorQuery });
    }
  }

  // Convert distance from radians to meters
  // The distance field contains distance from the 'near' point in radians
  // We convert it to meters for easier use (distance * Earth radius in meters)
  pipeline.push({
    $addFields: {
      distance: { $multiply: ['$distance', 1] }, // Distance from 'near' point in meters
    },
  });

  // Sort by distance (ascending) and _id
  const sortFields: Record<string, 1 | -1> = { distance: 1, _id: 1 };

  // Apply additional orderBy if specified
  for (const [field, order] of Object.entries(orderBy)) {
    if (field !== 'distance') {
      const normalizedOrder = order === 1 || order === 'asc' ? 1 : -1;
      sortFields[field] =
        direction === 'forward'
          ? normalizedOrder
          : normalizedOrder === 1
          ? -1
          : 1;
    }
  }

  // Reverse sort for backward pagination
  if (direction === 'backward') {
    for (const field of Object.keys(sortFields)) {
      sortFields[field] = sortFields[field] === 1 ? -1 : 1;
    }
  }

  pipeline.push({ $sort: sortFields });

  // Limit + 1 to check if there are more items
  pipeline.push({ $limit: limit + 1 });

  // Execute aggregation
  const items = await model.aggregate(pipeline);

  // Get total count for filtering (without cursor)
  const countPipeline: any[] = [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [near.lng, near.lat],
        },
        distanceField: 'distance',
        spherical: true,
        query: preMatchFilter,
      },
    },
  ];

  if (maxDistance !== undefined && maxDistance > 0) {
    countPipeline[0].$geoNear.maxDistance = metersToRadians(maxDistance);
  }

  const totalCount = await model.aggregate([
    ...countPipeline,
    { $count: 'total' },
  ]);

  const count = totalCount[0]?.total || 0;

  // Process results
  const hasMore = items.length > limit;
  let list = hasMore ? items.slice(0, limit) : items;

  if (direction === 'backward') {
    list = list.reverse();
  }

  // Generate cursors
  const sortFieldsForCursor = Object.keys({ distance: 1, ...orderBy });
  const startCursor =
    list.length > 0 ? encodeCursor(list[0], sortFieldsForCursor) : null;
  const endCursor =
    list.length > 0
      ? encodeCursor(list[list.length - 1], sortFieldsForCursor)
      : null;

  const pageInfo: PageInfo = {
    hasNextPage: direction === 'forward' ? hasMore : Boolean(cursor),
    hasPreviousPage: direction === 'backward' ? hasMore : Boolean(cursor),
    startCursor,
    endCursor,
  };

  return {
    list: list as T[],
    totalCount: count,
    pageInfo,
  };
}
