import { EventDispatcherReturn } from 'erxes-api-shared/core-modules';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { ICar, ICarDocument } from '../../@types/car';
import { requireArrayResult, requireCoreTRPC } from '../../core';
import { ROOT_CAR_CONTENT_TYPE } from '../../constants';
import {
  buildCarSearchText,
  extractMergeRelations,
  getActiveCarsSelector,
  getCarDisplayName,
  normalizeMergeCarIds,
} from '../../utils';
import { carSchema } from '../definitions/car';

type RelationDoc = {
  entities?: Array<{ contentType: string; contentId: string }>;
};

type CreateCarOptions = {
  idsToExclude?: string[];
};

export interface ICarModel extends Model<ICarDocument> {
  checkDuplication(
    carFields: Pick<ICar, 'plateNumber' | 'vinNumber'>,
    idsToExclude?: string[],
  ): Promise<void>;
  getCar(_id: string): Promise<ICarDocument>;
  createCar(
    doc: ICar,
    user?: any,
    options?: CreateCarOptions,
  ): Promise<ICarDocument>;
  updateCar(_id: string, doc: ICar): Promise<ICarDocument>;
  removeCars(carIds: string[]): Promise<{ deletedCount?: number }>;
  mergeCars(carIds: string[], carFields: Partial<ICar>): Promise<ICarDocument>;
}

const makeActivityLog = (
  activityType: string,
  targetId: string,
  description: string,
  changes: Record<string, any> = {},
) => ({
  activityType,
  target: { _id: targetId },
  action: {
    type: activityType,
    description,
  },
  changes,
});

export const loadCarClass = (
  models: IModels,
  subdomain: string,
  { sendDbEventLog, createActivityLog }: EventDispatcherReturn,
) => {
  class Cars {
    public static async checkDuplication(
      carFields: Pick<ICar, 'plateNumber' | 'vinNumber'>,
      idsToExclude: string[] = [],
    ) {
      const query: Record<string, any> = {
        ...getActiveCarsSelector(),
      };

      if (idsToExclude.length) {
        query._id = { $nin: idsToExclude };
      }

      if (carFields.plateNumber) {
        const duplicatedPlate = await models.Cars.findOne({
          ...query,
          plateNumber: carFields.plateNumber,
        }).lean();

        if (duplicatedPlate) {
          throw new Error('Duplicated plate number');
        }
      }

      if (carFields.vinNumber) {
        const duplicatedVin = await models.Cars.findOne({
          ...query,
          vinNumber: carFields.vinNumber,
        }).lean();

        if (duplicatedVin) {
          throw new Error('Duplicated VIN number');
        }
      }
    }

    public static async getCar(_id: string) {
      const car = await models.Cars.findOne({ _id });

      if (!car) {
        throw new Error('Car not found');
      }

      return car;
    }

    public static async createCar(
      doc: ICar,
      user?: any,
      options: CreateCarOptions = {},
    ) {
      await models.Cars.checkDuplication(doc, options.idsToExclude || []);

      const preparedDoc = {
        ...doc,
        ownerId: doc.ownerId || user?._id,
        mergedIds: doc.mergedIds || [],
        tagIds: doc.tagIds || [],
        searchText: buildCarSearchText(doc),
      };

      const car = await models.Cars.create(preparedDoc);

      sendDbEventLog?.({
        action: 'create',
        docId: car._id,
        currentDocument: car.toObject(),
      });

      createActivityLog?.(
        makeActivityLog(
          'create',
          car._id,
          `"${getCarDisplayName(car)}" has been created`,
        ),
      );

      return car;
    }

    public static async updateCar(_id: string, doc: ICar) {
      const previousCar = await models.Cars.getCar(_id);
      const previousCarObject = previousCar.toObject();

      await models.Cars.checkDuplication(doc, [_id]);

      const updateDoc = {
        ...doc,
        searchText: buildCarSearchText({
          ...previousCarObject,
          ...doc,
        }),
      };

      const updatedCar = await models.Cars.findOneAndUpdate(
        { _id },
        { $set: updateDoc },
        { new: true },
      );

      if (!updatedCar) {
        throw new Error('Car not found');
      }

      sendDbEventLog?.({
        action: 'update',
        docId: updatedCar._id,
        currentDocument: updatedCar.toObject(),
        prevDocument: previousCarObject,
      });

      createActivityLog?.(
        makeActivityLog(
          'update',
          updatedCar._id,
          `"${getCarDisplayName(previousCarObject)}" has been updated`,
          doc,
        ),
      );

      return updatedCar;
    }

    public static async removeCars(carIds: string[]) {
      const cars = await models.Cars.find({ _id: { $in: carIds } }).lean();

      // Core owns relations; internal-note cleanup is deferred to a platform PR.
      const cleanResult = await requireCoreTRPC<string>({
        subdomain,
        method: 'mutation',
        module: 'relation',
        action: 'cleanRelation',
        input: {
          contentType: ROOT_CAR_CONTENT_TYPE,
          contentIds: carIds,
        },
      });

      if (cleanResult !== 'success') {
        throw new Error(
          'Core relation.cleanRelation returned an invalid result',
        );
      }

      const result = await models.Cars.deleteMany({ _id: { $in: carIds } });

      for (const car of cars) {
        sendDbEventLog?.({
          action: 'delete',
          docId: car._id,
        });

        createActivityLog?.(
          makeActivityLog(
            'delete',
            car._id,
            `"${getCarDisplayName(car)}" has been deleted`,
          ),
        );
      }

      return result;
    }

    public static async mergeCars(carIds: string[], carFields: Partial<ICar>) {
      const sourceCarIds = normalizeMergeCarIds(carIds);

      if (sourceCarIds.length < 2) {
        throw new Error('At least two cars are required to merge');
      }

      const sourceCars = await models.Cars.find({
        ...getActiveCarsSelector(),
        _id: { $in: sourceCarIds },
      }).lean();

      if (sourceCars.length !== sourceCarIds.length) {
        throw new Error('One or more source cars were not found');
      }

      await models.Cars.checkDuplication(carFields, sourceCarIds);

      const relationDocs = (
        await Promise.all(
          sourceCars.map(async (car) =>
            requireArrayResult<RelationDoc>(
              await requireCoreTRPC<RelationDoc[]>({
                subdomain,
                module: 'relation',
                action: 'getRelationsByEntities',
                input: {
                  contentType: ROOT_CAR_CONTENT_TYPE,
                  contentId: car._id,
                },
              }),
              'Core relation.getRelationsByEntities',
            ),
          ),
        )
      ).flat();

      const sourceTagIds = Array.from(
        new Set(sourceCars.flatMap((car) => car.tagIds || [])),
      );

      const mergedTagIds = Object.prototype.hasOwnProperty.call(
        carFields,
        'tagIds',
      )
        ? carFields.tagIds || []
        : sourceTagIds;

      const mergedIds = Array.from(
        new Set([
          ...sourceCarIds,
          ...sourceCars.flatMap((car) => car.mergedIds || []),
        ]),
      );

      let mergedCar: ICarDocument | null = null;
      let sourcesSoftDeleted = false;

      try {
        mergedCar = await models.Cars.createCar(
          {
            ...carFields,
            tagIds: mergedTagIds,
            mergedIds,
          },
          undefined,
          { idsToExclude: sourceCarIds },
        );
        const mergedCarId = mergedCar._id;

        const relationsToCarry = extractMergeRelations(
          relationDocs,
          sourceCarIds,
        );

        if (relationsToCarry.length) {
          // Preserve non-car relations before soft-deleting merge source cars.
          requireArrayResult(
            await requireCoreTRPC({
              subdomain,
              method: 'mutation',
              module: 'relation',
              action: 'createMultipleRelations',
              input: {
                relations: relationsToCarry.map((relation) => ({
                  entities: [
                    {
                      contentType: ROOT_CAR_CONTENT_TYPE,
                      contentId: mergedCarId,
                    },
                    relation,
                  ],
                })),
              },
            }),
            'Core relation.createMultipleRelations',
          );
        }

        await models.Cars.updateMany(
          { _id: { $in: sourceCarIds } },
          { $set: { status: 'Deleted' } },
        );
        sourcesSoftDeleted = true;

        const mergeCleanResult = await requireCoreTRPC<string>({
          subdomain,
          method: 'mutation',
          module: 'relation',
          action: 'cleanRelation',
          input: {
            contentType: ROOT_CAR_CONTENT_TYPE,
            contentIds: sourceCarIds,
          },
        });

        if (mergeCleanResult !== 'success') {
          throw new Error(
            'Core relation.cleanRelation returned an invalid result',
          );
        }

        for (const sourceCar of sourceCars) {
          sendDbEventLog?.({
            action: 'update',
            docId: sourceCar._id,
            currentDocument: {
              ...sourceCar,
              status: 'Deleted',
            },
            prevDocument: sourceCar,
          });
        }

        createActivityLog?.(
          makeActivityLog(
            'merge',
            mergedCar._id,
            `"${getCarDisplayName(mergedCar)}" has been created from a merge`,
            { mergedIds },
          ),
        );

        return mergedCar;
      } catch (error) {
        const rollbackErrors: string[] = [];

        if (sourcesSoftDeleted) {
          try {
            await models.Cars.bulkWrite(
              sourceCars.map((sourceCar) => ({
                updateOne: {
                  filter: { _id: sourceCar._id },
                  update:
                    sourceCar.status === undefined
                      ? { $unset: { status: '' } }
                      : { $set: { status: sourceCar.status } },
                },
              })),
            );
          } catch (rollbackError) {
            rollbackErrors.push(
              rollbackError instanceof Error
                ? rollbackError.message
                : String(rollbackError),
            );
          }
        }

        if (mergedCar?._id) {
          try {
            const targetCleanResult = await requireCoreTRPC<string>({
              subdomain,
              method: 'mutation',
              module: 'relation',
              action: 'cleanRelation',
              input: {
                contentType: ROOT_CAR_CONTENT_TYPE,
                contentIds: [mergedCar._id],
              },
            });

            if (targetCleanResult !== 'success') {
              rollbackErrors.push(
                'Core relation.cleanRelation returned an invalid result for merged car rollback',
              );
            }
          } catch (rollbackError) {
            rollbackErrors.push(
              rollbackError instanceof Error
                ? rollbackError.message
                : String(rollbackError),
            );
          }

          try {
            await models.Cars.deleteOne({ _id: mergedCar._id });
            sendDbEventLog?.({
              action: 'delete',
              docId: mergedCar._id,
            });
          } catch (rollbackError) {
            rollbackErrors.push(
              rollbackError instanceof Error
                ? rollbackError.message
                : String(rollbackError),
            );
          }
        }

        if (rollbackErrors.length) {
          const message = error instanceof Error ? error.message : String(error);
          throw new Error(
            `Cars merge failed: ${message}. Rollback also failed: ${rollbackErrors.join('; ')}`,
          );
        }

        throw error;
      }
    }
  }

  carSchema.loadClass(Cars);

  return carSchema;
};
