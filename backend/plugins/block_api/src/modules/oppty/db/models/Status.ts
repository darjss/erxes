import { IOpptyStatus, IOpptyStatusDocument } from '@/oppty/@types/status';
import {
  DEFAULT_STATUS_TYPE_VALUES,
  DEFAULT_STATUS_TYPES,
  DEFAULT_STATUSES,
} from '@/oppty/constants';
import { statusSchema } from '@/oppty/db/definitions/status';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IOpptyStatusModel extends Model<any> {
  getOpptyStatus(_id: string): Promise<IOpptyStatusDocument>;
  getOpptyStatuses(projectId: string, type: string): Promise<IOpptyStatusDocument[]>;

  createOpptyStatus(input: IOpptyStatus): Promise<IOpptyStatusDocument>;
  updateOpptyStatus(_id: string, input: IOpptyStatus): Promise<IOpptyStatusDocument>;
  updateOpptyStatusOrder(_id: string, order: number): Promise<IOpptyStatusDocument>;
  removeOpptyStatus(_id: string): Promise<IOpptyStatusDocument>;

  validateOpptyStatus(status: IOpptyStatus): Promise<void>;
  generateDefaultOpptyStatus(projectId: string): Promise<void>;
}

export const loadOpptyStatusClass = (models: IModels) => {
  class Status {
    public static async getOpptyStatus(_id: string) {
      const status = await models.OpptyStatus.findOne({ _id });

      if (!status) {
        throw new Error('Status not found');
      }

      return status;
    }

    public static async getOpptyStatuses(projectId: string, type: string) {
      const project = await models.Project.getProject(projectId);

      return models.OpptyStatus.find({ projectId: project._id, type }).sort({ order: 1 }).lean();
    }

    public static async createOpptyStatus(input: IOpptyStatus) {
      await models.OpptyStatus.validateOpptyStatus(input);

      const { projectId, type } = input;

      const project = await models.Project.getProject(projectId);

      const lastStatus = await models.OpptyStatus.findOne({
        projectId: project._id,
        type,
      }).sort({ order: -1 });

      const order = lastStatus ? lastStatus.order + 1 : 0;

      const status = await models.OpptyStatus.create({
        ...input,
        order,
        projectId: project._id,
      });

      return status;
    }

    public static async updateOpptyStatus(_id: string, input: IOpptyStatus) {
      await models.OpptyStatus.validateOpptyStatus(input);

      const project = await models.Project.getProject(input.projectId);

      const status = await models.OpptyStatus.findOneAndUpdate(
        { _id },
        {
          ...input,
          projectId: project._id,
        },
        { new: true },
      );

      return status;
    }

    public static async updateOpptyStatusOrder(_id: string, order: number) {
      const status = await models.OpptyStatus.findOneAndUpdate(
        { _id },
        { $set: { order } },
        { new: true },
      );

      if (!status) {
        throw new Error('Status not found');
      }

      return status;
    }

    public static async removeOpptyStatus(_id: string) {
      const status = await models.OpptyStatus.findOneAndDelete({ _id });

      if (!status) {
        throw new Error('Status not found');
      }

      return status;
    }

    public static async generateDefaultOpptyStatus(projectId: string) {
      const existing = await models.OpptyStatus.exists({ projectId });

      if (existing) {
        return;
      }

      const statuses: IOpptyStatus[] = [];

      for (const STATUS_TYPE_KEY in DEFAULT_STATUS_TYPES) {
        const STATUS_TYPE = DEFAULT_STATUS_TYPES[STATUS_TYPE_KEY];

        const CHILDREN = DEFAULT_STATUSES[STATUS_TYPE];
        let order = 0;

        for (const CHILD_KEY in CHILDREN) {
          statuses.push({
            projectId,
            ...CHILDREN[CHILD_KEY],
            order,
          });
          order++;
        }
      }

      if (statuses.length) {
        await models.OpptyStatus.insertMany(statuses);
      }
    }

    public static async validateOpptyStatus(status: IOpptyStatus) {
      const { type } = status || {};

      if (!type) {
        throw new Error('Type is required');
      }

      if (type === DEFAULT_STATUS_TYPES.CLOSED_WON || type === DEFAULT_STATUS_TYPES.CLOSED_LOST) {
        throw new Error(`Cannot set status type to default status type: ${type}`);
      }

      const defaultTypes = Object.values(DEFAULT_STATUS_TYPES);

      if (!defaultTypes.includes(type)) {
        throw new Error(`Invalid status type: ${type}`);
      }

      const statusType = await models.OpptyStatus.findOne({ name: type });

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
