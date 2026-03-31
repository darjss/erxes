import { createActivity } from '@/activity/utils/createActivity';
import {
  IOppty,
  IOpptyDocument,
  IOpptyFilter,
  IOpptyInput,
} from '@/oppty/@types/oppty';
import { opptySchema } from '@/oppty/db/definitions/oppty';
import { DEFAULT_STATUS_TYPES } from '@/status/constants';
import { graphqlPubsub } from 'erxes-api-shared/utils';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { BLOCK_MODULES } from '~/constants';
import { IUnit } from '~/modules/unit/@types/unit';

export interface IOpptyModel extends Model<IOpptyDocument> {
  getOppty(_id: string): Promise<IOpptyDocument>;
  getOpptys(projectId: string, filter: IOpptyFilter): Promise<IOpptyDocument[]>;
  createOppty(input: IOpptyInput, userId: string): Promise<IOpptyDocument>;
  updateOppty(
    _id: string,
    input: Partial<IOpptyInput>,
    userId: string,
  ): Promise<IOpptyDocument>;
  deleteOppty(_id: string): Promise<IOpptyDocument | null>;
}

export const loadOpptyClass = (models: IModels, subdomain: string) => {
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

    public static async createOppty(input: IOppty, userId: string) {
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

    public static async updateOppty(
      _id: string,
      input: IOpptyInput,
      userId: string,
    ) {
      await this.validateOppty({ _id, ...input });

      if (input?.status) {
        const status = await models.Status.getStatus(input.status);

        if (input?.unit && status?.type === DEFAULT_STATUS_TYPES.NEGOTIATION) {
          const statusIds = await models.Status.find({
            type: DEFAULT_STATUS_TYPES.NEGOTIATION,
          }).distinct('_id');

          const exists = await models.Oppty.exists({
            unit: input.unit,
            status: { $in: statusIds },
          });

          if (exists) {
            throw new Error('Unit is already reserved');
          }

          await models.Unit.updateUnit(input.unit, {
            status: 'onHold',
          } as IUnit);
        }
      }

      const oppty = await models.Oppty.getOppty(_id);

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

      if (oppty && updatedOppty) {
        await createActivity<IOppty>({
          subdomain,

          oldDoc: oppty,
          newDoc: updatedOppty.toObject(),

          userId,
          contentId: _id,
          module: BLOCK_MODULES.OPPTY,
        });
      }

      return updatedOppty;
    }

    public static async deleteOppty(_id: string) {
      return models.Oppty.findOneAndDelete({ _id });
    }

    public static async validateOppty(input: Partial<IOpptyDocument>) {
      const oppty = await models.Oppty.findOne({ _id: input._id });

      const hasUnit =
        oppty?.unit ||
        (oppty?.propertyRows || []).some((row) => row.unitId && row.isMain);

      if (
        [
          DEFAULT_STATUS_TYPES.NEGOTIATION,
          DEFAULT_STATUS_TYPES.CLOSED_WON,
          DEFAULT_STATUS_TYPES.CLOSED_LOST,
        ].includes(input.status || '') &&
        !hasUnit
      ) {
        throw new Error('Unit is required');
      }

      return oppty;
    }
  }

  opptySchema.loadClass(Oppty);

  return opptySchema;
};
