import {
  IOppty,
  IOpptyDocument,
  IOpptyFilter,
  IBlockOpptyInput,
} from '@/oppty/@types/oppty';
import { opptySchema } from '@/oppty/db/definitions/oppty';
import { EventDispatcherReturn } from 'erxes-api-shared/core-modules';
import { graphqlPubsub } from 'erxes-api-shared/utils';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { generateOpptyUpdateActivityLogs } from '../../meta/activity-log';
import { STATUS_VALIDATION } from '../../utils/validation';
import { DEFAULT_STATUS_TYPES } from '../../../status/constants';

export interface IOpptyModel extends Model<IOpptyDocument> {
  getOppty(_id: string): Promise<IOpptyDocument>;
  getOpptys(projectId: string, filter: IOpptyFilter): Promise<IOpptyDocument[]>;
  createOppty(input: IBlockOpptyInput): Promise<IOpptyDocument>;
  updateOppty(
    _id: string,
    input: Partial<IBlockOpptyInput>,
  ): Promise<IOpptyDocument>;
  deleteOppty(_id: string): Promise<IOpptyDocument | null>;
}

export const loadOpptyClass = (
  models: IModels,
  _subdomain: string,
  { createActivityLog }: EventDispatcherReturn,
) => {
  class Oppty {
    public static async getOppty(_id: string) {
      const oppty = await models.Oppty.findOne({ _id });

      if (!oppty) {
        throw new Error('Oppty not found');
      }

      return oppty;
    }

    public static async getOpptys(projectId: string, filter: IOpptyFilter) {
      return models.Oppty.find({ projectId, ...filter });
    }

    public static async createOppty(input: IOppty) {
      const lastOppty = await models.Oppty.findOne({})
        .sort({ createdAt: -1 })
        .select('number');

      let nextNumber = 1;
      if (lastOppty?.number) {
        const match = lastOppty.number.match(/(\d+)$/);
        if (match) {
          nextNumber = parseInt(match[1], 10) + 1;
        }
      }

      input.number = `OPP-${String(nextNumber).padStart(5, '0')}`;

      const oppty = await models.Oppty.create(input);

      graphqlPubsub.publish('blockOpptyListChanged', {
        blockOpptyListChanged: { type: 'create', oppty },
      });

      return oppty;
    }

    public static async updateOppty(_id: string, input: IBlockOpptyInput) {
      await this.validateOppty(_id, input);
      const prevOppty = await models.Oppty.getOppty(_id);

      const wonStatus = await models.Status.findOne({
        projectId: prevOppty.projectId,
        type: DEFAULT_STATUS_TYPES.CLOSED_WON,
      });

      if (
        wonStatus &&
        wonStatus._id.equals(prevOppty.status) &&
        input.status &&
        !wonStatus._id.equals(input.status)
      ) {
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        if (prevOppty.updatedAt > oneMinuteAgo) {
          throw new Error(
            'Cannot change status: this opportunity was marked as Won less than 1 minute ago.',
          );
        }
      }

      const updatedOppty = await models.Oppty.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );

      graphqlPubsub.publish(`blockOpptyChanged:${_id}`, {
        blockOpptyChanged: { type: 'update', oppty: updatedOppty },
      });

      graphqlPubsub.publish('blockOpptyListChanged', {
        blockOpptyListChanged: { type: 'update', oppty: updatedOppty },
      });

      if (updatedOppty) {
        await generateOpptyUpdateActivityLogs(
          prevOppty.toObject(),
          updatedOppty.toObject(),
          createActivityLog,
        );
      }

      return updatedOppty;
    }

    public static async deleteOppty(_id: string) {
      return models.Oppty.findOneAndDelete({ _id });
    }

    public static async validateOppty(
      _id: string,
      input: Partial<IOpptyDocument>,
    ) {
      const { status } = input || {}; // status that the oppty is being updated to

      if (!status) return; // if status is not being updated, no validation is needed

      const oppty = await models.Oppty.getOppty(_id);

      // validates based on status type
      const { type } = (await models.Status.findOne({ _id: status })) || {};

      if (!type) {
        throw new Error('The status has an invalid type');
      }

      // this function calculate the sum of numbers
      const validation = STATUS_VALIDATION[type];

      // if there is no validation then it means the status type has no specific validation requirements
      if (!validation) return;

      await validation(status, oppty, models);
    }
  }

  opptySchema.loadClass(Oppty);

  return opptySchema;
};
