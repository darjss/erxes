import { EventDispatcherReturn } from 'erxes-api-shared/core-modules';
import { escapeRegExp } from 'erxes-api-shared/utils';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { ICarCategory, ICarCategoryDocument } from '../../@types/car';
import { carCategorySchema } from '../definitions/car';

export interface ICarCategoryModel extends Model<ICarCategoryDocument> {
  getCarCategory(selector: Record<string, any>): Promise<ICarCategoryDocument>;
  generateOrder(
    parentCategory: ICarCategoryDocument | null,
    doc: Partial<ICarCategory>,
  ): Promise<string>;
  createCarCategory(doc: ICarCategory): Promise<ICarCategoryDocument>;
  updateCarCategory(
    _id: string,
    doc: Partial<ICarCategory>,
  ): Promise<ICarCategoryDocument>;
  removeCarCategory(_id: string): Promise<{ deletedCount?: number }>;
}

const makeCategoryActivityLog = (
  activityType: string,
  targetId: string,
  description: string,
  changes: Record<string, any> = {},
) => ({
  activityType,
  target: { _id: targetId },
  action: { type: activityType, description },
  changes,
});

export const loadCarCategoryClass = (
  models: IModels,
  _subdomain: string,
  { sendDbEventLog, createActivityLog }: EventDispatcherReturn,
) => {
  class CarCategories {
    public static async getCarCategory(selector: Record<string, any>) {
      const category = await models.CarCategories.findOne(selector);

      if (!category) {
        throw new Error('Car category not found');
      }

      return category;
    }

    public static async generateOrder(
      parentCategory: ICarCategoryDocument | null,
      doc: Partial<ICarCategory>,
    ) {
      return parentCategory
        ? `${parentCategory.order}/${doc.code}`
        : `${doc.code}`;
    }

    public static async createCarCategory(doc: ICarCategory) {
      const parentCategory = doc.parentId
        ? await models.CarCategories.findOne({ _id: doc.parentId })
        : null;

      if (doc.parentId && !parentCategory) {
        throw new Error('Parent car category not found');
      }

      const order = await models.CarCategories.generateOrder(
        parentCategory,
        doc,
      );

      const category = await models.CarCategories.create({
        ...doc,
        order,
      });

      sendDbEventLog?.({
        action: 'create',
        docId: category._id,
        currentDocument: category.toObject(),
      });

      createActivityLog?.(
        makeCategoryActivityLog(
          'create',
          category._id,
          `"${category.name}" has been created`,
        ),
      );

      return category;
    }

    public static async updateCarCategory(
      _id: string,
      doc: Partial<ICarCategory>,
    ) {
      const previousCategory = await models.CarCategories.getCarCategory({
        _id,
      });
      const previousCategoryObject = previousCategory.toObject();
      const previousOrderPrefix = escapeRegExp(previousCategory.order || '');
      const descendantOrderPattern = new RegExp(
        `^${previousOrderPrefix}(?:/|$)`,
      );
      const nextParentId = Object.prototype.hasOwnProperty.call(
        doc,
        'parentId',
      )
        ? doc.parentId
        : previousCategory.parentId;

      const parentCategory = nextParentId
        ? await models.CarCategories.findOne({ _id: nextParentId })
        : null;

      if (nextParentId && !parentCategory) {
        throw new Error('Parent car category not found');
      }

      if (
        parentCategory &&
        (String(parentCategory._id) === _id ||
          descendantOrderPattern.test(parentCategory.order || ''))
      ) {
        throw new Error('Cannot change category');
      }

      const order = await models.CarCategories.generateOrder(parentCategory, {
        ...previousCategoryObject,
        ...doc,
      });

      const childCategories = await models.CarCategories.find({
        _id: { $ne: _id },
        order: {
          $regex: descendantOrderPattern,
        },
      }).lean();

      await models.CarCategories.updateOne(
        { _id },
        {
          $set: {
            ...doc,
            order,
          },
        },
      );

      if (childCategories.length) {
        await models.CarCategories.bulkWrite(
          childCategories.map((category) => ({
            updateOne: {
              filter: { _id: category._id },
              update: {
                $set: {
                  order: category.order?.replace(
                    previousCategory.order || '',
                    order,
                  ),
                },
              },
            },
          })),
        );
      }

      const updatedCategory = await models.CarCategories.findOne({ _id });

      if (!updatedCategory) {
        throw new Error('Car category not found');
      }

      sendDbEventLog?.({
        action: 'update',
        docId: updatedCategory._id,
        currentDocument: updatedCategory.toObject(),
        prevDocument: previousCategoryObject,
      });

      createActivityLog?.(
        makeCategoryActivityLog(
          'update',
          updatedCategory._id,
          `"${previousCategory.name}" has been updated`,
          doc,
        ),
      );

      return updatedCategory;
    }

    public static async removeCarCategory(_id: string) {
      const category = await models.CarCategories.getCarCategory({ _id });

      const relatedCarsCount = await models.Cars.countDocuments({
        categoryId: _id,
      });
      const childCategoriesCount = await models.CarCategories.countDocuments({
        parentId: _id,
      });

      if (relatedCarsCount + childCategoriesCount > 0) {
        throw new Error("Can't remove a car category");
      }

      const result = await models.CarCategories.deleteOne({ _id });

      sendDbEventLog?.({
        action: 'delete',
        docId: _id,
      });

      createActivityLog?.(
        makeCategoryActivityLog(
          'delete',
          _id,
          `"${category.name}" has been deleted`,
        ),
      );

      return result;
    }
  }

  carCategorySchema.loadClass(CarCategories);

  return carCategorySchema;
};
