import { IStatus, IStatusDocument } from '@/oppty/@types/status';
import {
  DEFAULT_STATUS_TYPE_VALUES,
  DEFAULT_STATUS_TYPES,
  DEFAULT_STATUSES,
  ORDER_GAP,
} from '@/oppty/constants';
import { statusSchema } from '@/oppty/db/definitions/status';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IStatusModel extends Model<any> {
  getStatus(_id: string): Promise<IStatusDocument>;
  getStatuses(projectId: string, type?: string): Promise<IStatusDocument[]>;
  getStatusTypes(projectId: string): Promise<IStatusDocument[]>;

  createStatus(input: IStatus): Promise<IStatusDocument>;
  updateStatus(_id: string, input: IStatus): Promise<IStatusDocument>;
  updateStatusOrder(_id: string, order: number): Promise<IStatusDocument>;
  removeStatus(_id: string): Promise<IStatusDocument>;

  validateStatus(status: IStatus): Promise<void>;
  generateDefaultStatus(projectId: string): Promise<void>;
}

export const loadBlockOpptyStatusClass = (models: IModels) => {
  class Status {
    public static async getStatus(_id: string) {
      const status = await models.Status.findOne({ _id });

      if (!status) {
        throw new Error('Status not found');
      }

      return status;
    }

    public static async getStatusTypes(projectId: string) {
      const project = await models.Project.getProject(projectId);

      const existing = await models.Status.find({
        projectId: project._id,
      })
        .sort({ order: 1 })
        .lean();

      if (existing.length > 0) {
        return existing;
      }

      await this.generateDefaultStatus(project._id);

      return models.Status.find({
        projectId: project._id,
      })
        .sort({ order: 1 })
        .lean();
    }

    public static async getStatuses(projectId: string) {
      const project = await models.Project.getProject(projectId);

      const query: any = { projectId: project._id };

      const statuses = await models.Status.find(query)
        .sort({ order: 1 })
        .lean();

      if (statuses.length > 0) {
        return statuses;
      }

      await this.generateDefaultStatus(project._id);

      return models.Status.find(query).sort({ order: 1 }).lean();
    }

    public static async createStatus(input: IStatus) {
      await models.Status.validateStatus(input);

      const { projectId, type } = input;

      const project = await models.Project.getProject(projectId);

      const order = await this.generateOrder(project._id, type);

      const status = await models.Status.create({
        ...input,
        order,
        projectId: project._id,
      });

      return status;
    }

    public static async updateStatus(_id: string, input: IStatus) {
      await models.Status.validateStatus(input);

      const project = await models.Project.getProject(input.projectId);

      const status = await models.Status.findOneAndUpdate(
        { _id },
        {
          ...input,
          projectId: project._id,
        },
        { new: true },
      );

      return status;
    }

    public static async updateStatusOrder(_id: string, order: number) {
      const status = await models.Status.findOneAndUpdate(
        { _id },
        { $set: { order } },
        { new: true },
      );

      if (!status) {
        throw new Error('Status not found');
      }

      return status;
    }

    public static async removeStatus(_id: string) {
      const status = await models.Status.findOneAndDelete({ _id });

      if (!status) {
        throw new Error('Status not found');
      }

      return status;
    }

    public static async generateDefaultStatus(projectId: string) {
      const existing = await models.Status.exists({ projectId });

      if (existing) {
        return;
      }

      const statuses: IStatus[] = [];
      let order = ORDER_GAP;

      for (const STATUS_TYPE_KEY in DEFAULT_STATUS_TYPES) {
        const STATUS_TYPE = DEFAULT_STATUS_TYPES[STATUS_TYPE_KEY];

        statuses.push({
          projectId,
          ...DEFAULT_STATUS_TYPE_VALUES[STATUS_TYPE],
          order,
        });
        order += ORDER_GAP;

        const CHILDREN = DEFAULT_STATUSES[STATUS_TYPE];

        for (const CHILD_KEY in CHILDREN) {
          statuses.push({
            projectId,
            ...CHILDREN[CHILD_KEY],
            order,
          });
          order += ORDER_GAP;
        }
      }

      if (statuses.length) {
        await models.Status.insertMany(statuses);
      }
    }

    private static async generateOrder(projectId: string, type: string) {
      const lastOfType = await models.Status.findOne({
        projectId,
        type,
      }).sort({ order: -1 });

      if (!lastOfType) {
        const typeHeader = await models.Status.findOne({
          projectId,
          type: '',
          name: { $regex: new RegExp(`^${type}$`, 'i') },
        });

        const headerOrder = typeHeader?.order ?? 0;

        const nextAfterHeader = await models.Status.findOne({
          projectId,
          order: { $gt: headerOrder },
          _id: { $ne: typeHeader?._id },
        }).sort({ order: 1 });

        if (nextAfterHeader) {
          return (headerOrder + nextAfterHeader.order) / 2;
        }

        return headerOrder + ORDER_GAP;
      }

      const nextAfter = await models.Status.findOne({
        projectId,
        order: { $gt: lastOfType.order },
        type: { $ne: type },
      }).sort({ order: 1 });

      if (nextAfter) {
        return (lastOfType.order + nextAfter.order) / 2;
      }

      return lastOfType.order + ORDER_GAP;
    }

    public static async validateStatus(status: IStatus) {
      const { type } = status || {};

      if (!type) {
        throw new Error('Type is required');
      }

      const defaultTypes = Object.values(DEFAULT_STATUS_TYPES);

      if (!defaultTypes.includes(type)) {
        throw new Error(`Invalid status type: ${type}`);
      }

      const statusType = await models.Status.findOne({ name: type });

      if (statusType) {
        throw new Error(
          `Cannot set status type to another status type: ${type}`,
        );
      }
    }
  }

  statusSchema.loadClass(Status);

  return statusSchema;
};
