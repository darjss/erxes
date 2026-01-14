import { IOppty, IOpptyDocument, IOpptyFilter } from '@/oppty/@types/oppty';
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
  }

  opptySchema.loadClass(Oppty);

  return opptySchema;
};
