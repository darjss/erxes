import { Model } from 'mongoose';
import { IContractDocument, ContractStatus } from '@/contract/@types/contract';

import { IContract } from '@/contract/@types/contract';
import { IModels } from '~/connectionResolvers';
import { contractSchema } from '@/contract/db/definitions/contract';
import { EventDispatcherReturn } from 'erxes-api-shared/core-modules';
import { generateContractUpdateActivityLogs } from '../../meta/activity-log';

export interface IContractModel extends Model<IContractDocument> {
  createContract(input: IContract): Promise<IContractDocument>;
  updateContract(_id: string, input: IContract): Promise<IContractDocument>;
  updateContractStatus(
    _id: string,
    status: ContractStatus,
  ): Promise<IContractDocument>;
  getContract(_id: string): Promise<IContractDocument | null>;
  getContracts(): Promise<IContractDocument[]>;
  deleteContract(_id: string): Promise<IContractDocument | null>;
}

export const loadContractClass = (
  models: IModels,
  eventHandlers?: EventDispatcherReturn,
) => {
  const createActivityLog = eventHandlers?.createActivityLog;

  class Contract {
    public static async createContract(input: IContract) {
      return models.Contract.create(input);
    }

    public static async updateContract(_id: string, input: IContract) {
      const prev = await models.Contract.findOne({ _id });

      const updated = await models.Contract.findOneAndUpdate({ _id }, input, {
        new: true,
      });

      if (prev && updated && createActivityLog) {
        await generateContractUpdateActivityLogs(
          prev.toObject(),
          updated.toObject(),
          createActivityLog,
        );
      }

      return updated;
    }

    public static async updateContractStatus(
      _id: string,
      status: ContractStatus,
    ) {
      const contract = await models.Contract.findOne({ _id });

      if (!contract) {
        throw new Error('Contract not found');
      }

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const withinRevertWindow =
        contract.updatedAt && contract.updatedAt > fiveMinutesAgo;

      if (
        contract.status === ContractStatus.CANCELLED &&
        !withinRevertWindow
      ) {
        throw new Error('Cannot change status of a cancelled contract');
      }

      if (
        contract.status === ContractStatus.SIGNED &&
        status === ContractStatus.DRAFT &&
        !withinRevertWindow
      ) {
        throw new Error('Cannot revert a signed contract to draft');
      }

      const prev = contract.toObject();

      const updated = await models.Contract.findOneAndUpdate(
        { _id },
        { $set: { status } },
        { new: true },
      );

      if (updated && createActivityLog) {
        await generateContractUpdateActivityLogs(
          prev,
          updated.toObject(),
          createActivityLog,
        );
      }

      return updated;
    }

    public static async getContract(_id: string) {
      return models.Contract.findOne({ _id });
    }

    public static async deleteContract(_id: string) {
      return models.Contract.findOneAndDelete({ _id });
    }
  }

  contractSchema.loadClass(Contract);

  return contractSchema;
};
