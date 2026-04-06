import { Model } from 'mongoose';
import { IContractDocument, ContractStatus } from '@/contract/@types/contract';

import { IContract } from '@/contract/@types/contract';
import { IModels } from '~/connectionResolvers';
import { contractSchema } from '@/contract/db/definitions/contract';

export interface IContractModel extends Model<IContractDocument> {
  createContract(input: IContract): Promise<IContractDocument>;
  updateContract(_id: string, input: IContract): Promise<IContractDocument>;
  updateContractStatus(_id: string, status: ContractStatus): Promise<IContractDocument>;
  getContract(_id: string): Promise<IContractDocument | null>;
  getContracts(): Promise<IContractDocument[]>;
  deleteContract(_id: string): Promise<IContractDocument | null>;
}

export const loadContractClass = (models: IModels) => {
  class Contract {
    public static async createContract(input: IContract) {
      return models.Contract.create(input);
    }

    public static async updateContract(_id: string, input: IContract) {
      return models.Contract.findOneAndUpdate({ _id }, input, {
        new: true,
      });
    }

    public static async updateContractStatus(_id: string, status: ContractStatus) {
      const contract = await models.Contract.findOne({ _id });

      if (!contract) {
        throw new Error('Contract not found');
      }

      if (contract.status === ContractStatus.CANCELLED) {
        throw new Error('Cannot change status of a cancelled contract');
      }

      if (
        contract.status === ContractStatus.SIGNED &&
        status === ContractStatus.DRAFT
      ) {
        throw new Error('Cannot revert a signed contract to draft');
      }

      return models.Contract.findOneAndUpdate(
        { _id },
        { $set: { status } },
        { new: true },
      );
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
