import { Model } from 'mongoose';
import {
  IContractPayment,
  IContractPaymentDocument,
} from '@/contract/@types/payment';
import { IContractPaymentTransactionDocument } from '@/contract/@types/transaction';
import { IModels } from '~/connectionResolvers';
import { contractPaymentSchema } from '@/contract/db/definitions/payment';

export interface IContractPaymentModel extends Model<IContractPaymentDocument> {
  regenerateForContract(
    contractId: string,
  ): Promise<IContractPaymentDocument[]>;
  recomputeStatus(
    paymentId: string,
  ): Promise<IContractPaymentDocument | null>;
  addTransaction(
    paymentId: string,
    input: {
      amount: number;
      date?: Date;
      note?: string;
      createdBy?: string;
    },
  ): Promise<IContractPaymentTransactionDocument>;
  updateTransaction(
    _id: string,
    input: { amount?: number; date?: Date; note?: string },
  ): Promise<IContractPaymentTransactionDocument | null>;
  removeTransaction(
    _id: string,
  ): Promise<IContractPaymentTransactionDocument>;
}

const addMonths = (base: Date, months: number) => {
  const d = new Date(base);
  d.setMonth(d.getMonth() + months);
  return d;
};
const addYears = (base: Date, years: number) => {
  const d = new Date(base);
  d.setFullYear(d.getFullYear() + years);
  return d;
};
const setSafeDay = (date: Date, day: number) => {
  const d = new Date(date);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, lastDay));
  return d;
};

function generateInstallmentDates(
  startDate: Date,
  count: number,
  frequency: string | undefined,
  paymentDates: number[],
): Date[] {
  const dates: Date[] = [];
  const days = paymentDates.length ? paymentDates : [15];

  switch (frequency) {
    case 'ONE_TIME_PER_MONTH':
      for (let i = 0; i < count; i++)
        dates.push(setSafeDay(addMonths(startDate, i + 1), days[0]));
      break;
    case 'TWO_TIME_PER_MONTH': {
      const dd = days.length >= 2 ? days.slice(0, 2) : [15, 30];
      const monthsNeeded = Math.ceil(count / 2);
      for (let m = 0; m < monthsNeeded; m++) {
        for (let i = 0; i < dd.length && dates.length < count; i++)
          dates.push(setSafeDay(addMonths(startDate, m + 1), dd[i]));
      }
      break;
    }
    case 'THREE_TIME_PER_MONTH': {
      const dd = days.length >= 3 ? days.slice(0, 3) : [10, 20, 30];
      const monthsNeeded = Math.ceil(count / 3);
      for (let m = 0; m < monthsNeeded; m++) {
        for (let i = 0; i < dd.length && dates.length < count; i++)
          dates.push(setSafeDay(addMonths(startDate, m + 1), dd[i]));
      }
      break;
    }
    case 'QUARTERLY':
      for (let i = 0; i < count; i++)
        dates.push(setSafeDay(addMonths(startDate, (i + 1) * 3), days[0]));
      break;
    case 'HALF_YEARLY':
      for (let i = 0; i < count; i++)
        dates.push(setSafeDay(addMonths(startDate, (i + 1) * 6), days[0]));
      break;
    case 'YEARLY':
      for (let i = 0; i < count; i++)
        dates.push(setSafeDay(addYears(startDate, i + 1), days[0]));
      break;
    case 'ONE_TIME':
      break;
    default:
      for (let i = 0; i < count; i++)
        dates.push(setSafeDay(addMonths(startDate, i + 1), days[0]));
  }
  return dates;
}

export const loadContractPaymentClass = (models: IModels) => {
  class ContractPayment {
    public static async regenerateForContract(contractId: string) {
      const contract = await models.Contract.findOne({ _id: contractId });
      if (!contract) return [];

      if (contract.status) {
        const stage = await models.ContractStatus.findOne({
          _id: contract.status,
        });
        if (stage?.type === 'signed') return [];
      }

      const contractNumber = contract.number;
      const partyId = contract.party?.id;
      const partyType = contract.party?.type;

      const projectId = await (async () => {
        if (!contract.unit) return undefined;
        const unit = await models.Unit.findOne({ _id: contract.unit });
        if (!unit?.zoning) return undefined;
        const zoning = await models.Zoning.findOne({ _id: unit.zoning });
        if (!zoning?.building) return undefined;
        const building = await models.Building.findOne({ _id: zoning.building });
        return building?.project;
      })();

      const existingPayments = await models.ContractPayment.find({
        contractId,
      }).lean();
      const existingByIndex = new Map<number, any>();
      const paymentIdsToDelete: string[] = [];
      for (const p of existingPayments) {
        existingByIndex.set(p.index, p);
        paymentIdsToDelete.push(p._id.toString());
      }

      // Keep transactions for payments that will be regenerated with same index
      const existingTransactions = paymentIdsToDelete.length
        ? await models.ContractPaymentTransaction.find({
            paymentId: { $in: paymentIdsToDelete },
          }).lean()
        : [];
      const txByOldPaymentId = new Map<string, any[]>();
      for (const tx of existingTransactions) {
        const key = tx.paymentId.toString();
        if (!txByOldPaymentId.has(key)) txByOldPaymentId.set(key, []);
        txByOldPaymentId.get(key)!.push(tx);
      }

      await models.ContractPayment.deleteMany({ contractId });
      await models.ContractPaymentTransaction.deleteMany({ contractId });

      const paymentPlan = contract.paymentPlan as any;
      if (!paymentPlan) return [];

      const totalPrice = contract.amount || 0;
      const downPct = paymentPlan.downPaymentPercentage || 0;
      const discountPct = paymentPlan.discountPercentage || 0;
      const interestPct = paymentPlan.interestPercentage || 0;
      const interestType = paymentPlan.interestType || 'FLAT';
      const installmentCount = Math.max(0, paymentPlan.installment || 0);
      const isOneTime = paymentPlan.frequency === 'ONE_TIME';

      const discountAmount = (totalPrice * discountPct) / 100;
      const priceAfterDiscount = totalPrice - discountAmount;
      const downAmount = (priceAfterDiscount * downPct) / 100;
      const principal = priceAfterDiscount - downAmount;

      const startDate =
        contract.startDate || contract.date || new Date();
      const customDueDates = (paymentPlan.paymentDueDates || [])
        .map((d: string) => (d ? new Date(d) : null))
        .filter((d): d is Date => !!d && !isNaN(d.getTime()));

      const autoDates = isOneTime
        ? []
        : generateInstallmentDates(
            startDate,
            installmentCount,
            paymentPlan.frequency,
            paymentPlan.paymentDates || [],
          );

      const dates: Date[] = isOneTime
        ? []
        : Array.from({ length: installmentCount }).map(
            (_, i) => customDueDates[i] || autoDates[i],
          );

      const rows: IContractPayment[] = [];
      const currency = contract.currency || 'MNT';
      const commonFields = {
        contractId,
        contractNumber,
        partyId,
        partyType,
        projectId,
        unit: contract.unit,
        currency,
        paid: false,
      };

      if (isOneTime) {
        const totalInterest = (priceAfterDiscount * interestPct) / 100;
        rows.push({
          ...commonFields,
          index: 0,
          label: 'Full payment',
          dueDate: contract.date || startDate,
          amount: priceAfterDiscount + totalInterest,
        });
      } else {
        if (downAmount > 0 || downPct > 0) {
          rows.push({
            ...commonFields,
            index: 0,
            label: 'Down payment',
            dueDate: contract.date || startDate,
            amount: downAmount,
          });
        }

        const principalPerInstallment =
          installmentCount > 0 ? principal / installmentCount : 0;

        for (let i = 0; i < installmentCount; i++) {
          let interest = 0;

          if (interestPct > 0 && installmentCount > 0) {
            if (interestType === 'FLAT') {
              interest = (principal * interestPct) / 100 / installmentCount;
            } else if (interestType === 'REDUCING') {
              const remainingPrincipal = principal - principalPerInstallment * i;
              interest = (remainingPrincipal * interestPct) / 100 / 12;
            } else {
              interest = (principal * interestPct) / 100 / installmentCount;
            }
          }

          rows.push({
            ...commonFields,
            index: i + 1,
            label: `Installment ${i + 1}`,
            dueDate: dates[i] || startDate,
            amount: principalPerInstallment + interest,
          });
        }
      }

      if (rows.length) {
        const created = await models.ContractPayment.insertMany(rows);

        // Restore transactions from old payments matching by index
        for (const newPayment of created) {
          const oldPayment = existingByIndex.get(newPayment.index);
          if (!oldPayment) continue;
          const oldTxs = txByOldPaymentId.get(oldPayment._id.toString()) || [];
          if (oldTxs.length === 0) continue;
          const newTxs = oldTxs.map((tx) => ({
            paymentId: newPayment._id,
            contractId: newPayment.contractId,
            amount: tx.amount,
            date: tx.date,
            note: tx.note,
            createdBy: tx.createdBy,
          }));
          await models.ContractPaymentTransaction.insertMany(newTxs);
          await ContractPayment.recomputeStatus(newPayment._id.toString());
        }

        return created;
      }
      return [];
    }

    public static async recomputeStatus(paymentId: string) {
      const payment = await models.ContractPayment.findOne({ _id: paymentId });
      if (!payment) return null;

      const transactions = await models.ContractPaymentTransaction.find({
        paymentId,
      }).lean();

      const paidAmount = transactions.reduce(
        (sum, tx) => sum + (tx.amount || 0),
        0,
      );

      let status: 'unpaid' | 'partial' | 'paid' = 'unpaid';
      if (paidAmount >= payment.amount) {
        status = 'paid';
      } else if (paidAmount > 0) {
        status = 'partial';
      }

      const latestTx = transactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0];

      return models.ContractPayment.findOneAndUpdate(
        { _id: paymentId },
        {
          $set: {
            status,
            paidAmount,
            paidDate: latestTx?.date,
          },
        },
        { new: true },
      );
    }

    public static async addTransaction(
      paymentId: string,
      input: { amount: number; date?: Date; note?: string; createdBy?: string },
    ) {
      const payment = await models.ContractPayment.findOne({ _id: paymentId });
      if (!payment) throw new Error('Payment not found');

      const tx = await models.ContractPaymentTransaction.create({
        paymentId,
        contractId: payment.contractId,
        amount: input.amount,
        date: input.date || new Date(),
        note: input.note,
        createdBy: input.createdBy,
      });

      await ContractPayment.recomputeStatus(paymentId);
      return tx;
    }

    public static async updateTransaction(
      _id: string,
      input: { amount?: number; date?: Date; note?: string },
    ) {
      const tx = await models.ContractPaymentTransaction.findOne({ _id });
      if (!tx) throw new Error('Transaction not found');

      const updated = await models.ContractPaymentTransaction.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );

      await ContractPayment.recomputeStatus(tx.paymentId.toString());
      return updated;
    }

    public static async removeTransaction(_id: string) {
      const tx = await models.ContractPaymentTransaction.findOne({ _id });
      if (!tx) throw new Error('Transaction not found');

      const paymentId = tx.paymentId.toString();
      await models.ContractPaymentTransaction.deleteOne({ _id });
      await ContractPayment.recomputeStatus(paymentId);
      return tx;
    }
  }

  contractPaymentSchema.loadClass(ContractPayment);
  return contractPaymentSchema;
};
