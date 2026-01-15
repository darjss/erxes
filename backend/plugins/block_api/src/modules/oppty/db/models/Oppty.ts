import { IOppty, IOpptyDocument, IOpptyFilter } from '@/oppty/@types/oppty';
import { OPPTY_STATUSES } from '@/oppty/constants';
import { opptySchema } from '@/oppty/db/definitions/oppty';
import { graphqlPubsub } from 'erxes-api-shared/utils';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { BLOCK_MODULES } from '~/constants';
import { createActivity } from '~/modules/activity/utils/createActivity';

export interface IOpptyModel extends Model<IOpptyDocument> {
  createOppty(input: IOppty, userId: string): Promise<IOpptyDocument>;
  updateOppty(
    _id: string,
    input: Partial<IOppty>,
    userId: string,
  ): Promise<IOpptyDocument>;
  getOppty(_id: string): Promise<IOpptyDocument>;
  getOpptys(projectId: string, filter: IOpptyFilter): Promise<IOpptyDocument[]>;
  deleteOppty(_id: string): Promise<IOpptyDocument | null>;
}

export const loadOpptyClass = (models: IModels, subdomain: string) => {
  class Oppty {
    public static async createOppty(input: IOppty, userId: string) {
      graphqlPubsub.publish('blockOpptyListChanged', {
        blockOpptyListChanged: { type: 'create', oppty: input },
      });

      return models.Oppty.create(input);
    }

    public static async updateOppty(
      _id: string,
      input: Partial<IOppty>,
      userId: string,
    ) {
      await this.validateOppty({ _id, ...input });

      const oppty = await models.Oppty.getOppty(_id);

      if (input?.status === OPPTY_STATUSES.RESERVATION) {
        const exists = await models.Oppty.exists({
          unit: oppty.unit,
          status: OPPTY_STATUSES.RESERVATION,
        });

        if (exists) {
          throw new Error('Unit is already reserved');
        }

        await models.Unit.findOneAndUpdate(
          { _id: oppty.unit },
          { status: 'onHold' },
        );
      }

      const updatedOppty = await models.Oppty.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );

      if (input?.status === OPPTY_STATUSES.CANCELLED) {
        const exists = await models.Oppty.exists({
          unit: oppty.unit,
          status: OPPTY_STATUSES.RESERVATION,
        });

        if (exists) {
          throw new Error('Unit is already reserved');
        }

        await models.Unit.findOneAndUpdate(
          { _id: oppty.unit },
          { status: 'onHold' },
        );
      }

      graphqlPubsub.publish(`blockOpptyChanged:${_id}`, {
        blockOpptyChanged: { type: 'update', oppty: updatedOppty },
      });

      graphqlPubsub.publish('blockOpptyListChanged', {
        blockOpptyListChanged: { type: 'update', oppty: updatedOppty },
      });

      await createActivity<IOppty>({
        subdomain,

        oldDoc: oppty,
        newDoc: input,

        userId,
        contentId: _id,
        module: BLOCK_MODULES.OPPTY,
      });

      return updatedOppty;
    }

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

    public static async deleteOppty(_id: string) {
      return models.Oppty.findOneAndDelete({ _id });
    }

    public static async validateOppty(input: Partial<IOpptyDocument>) {
      const oppty = await models.Oppty.findOne({ _id: input._id });

      if (
        [OPPTY_STATUSES.RESERVATION, OPPTY_STATUSES.CANCELLED].includes(
          input.status || '',
        ) &&
        !oppty?.unit
      ) {
        throw new Error('Unit is required');
      }
    }
  }

  opptySchema.loadClass(Oppty);

  return opptySchema;
};
