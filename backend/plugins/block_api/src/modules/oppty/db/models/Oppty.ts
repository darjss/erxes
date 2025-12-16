import { Model } from 'mongoose';
import { opptySchema } from '@/oppty/db/definitions/oppty';
import { IOppty, IOpptyDocument, IOpptyFilter } from '@/oppty/@types/oppty';
import { IModels } from '~/connectionResolvers';
import { graphqlPubsub } from 'erxes-api-shared/utils';

export interface IOpptyModel extends Model<IOpptyDocument> {
  createOppty(input: IOppty): Promise<IOpptyDocument>;
  updateOppty(_id: string, input: Partial<IOppty>): Promise<IOpptyDocument>;
  getOppty(_id: string): Promise<IOpptyDocument>;
  getOpptys(projectId: string, filter: IOpptyFilter): Promise<IOpptyDocument[]>;
  deleteOppty(_id: string): Promise<IOpptyDocument | null>;
}

export const loadOpptyClass = (models: IModels) => {
  class Oppty {
    public static async createOppty(input: IOppty) {
      graphqlPubsub.publish('blockOpptyListChanged', {
        blockOpptyListChanged: { type: 'create', oppty: input },
      });

      return models.Oppty.create(input);
    }

    public static async updateOppty(_id: string, input: Partial<IOppty>) {
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
      return updatedOppty;
    }

    public static async getOppty(_id: string) {
      return models.Oppty.findOne({ _id });
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
