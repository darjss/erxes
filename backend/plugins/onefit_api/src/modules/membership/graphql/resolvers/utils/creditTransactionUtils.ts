import { IModels } from '~/connectionResolvers';
import { CreditTransactionType } from '@/membership/@types/credittransaction';
import { ICreditTransactionDocument } from '@/membership/@types/credittransaction';

export function computeEarnedAndUsedFromTransactions(
  transactions: ICreditTransactionDocument[],
): { totalCreditsEarned: number; totalCreditsUsed: number } {
  let totalCreditsEarned = 0;
  let totalCreditsUsed = 0;

  for (const tx of transactions) {
    switch (tx.transactionType) {
      case CreditTransactionType.PURCHASE:
        totalCreditsEarned += tx.amount;
        break;
      case CreditTransactionType.USAGE:
        totalCreditsUsed += Math.abs(tx.amount);
        break;
      case CreditTransactionType.REFUND:
        totalCreditsUsed -= tx.amount;
        break;
      case CreditTransactionType.EXPIRATION:
        totalCreditsUsed += Math.abs(tx.amount);
        break;
      default:
        break;
    }
  }

  return {
    totalCreditsEarned,
    totalCreditsUsed: Math.max(0, totalCreditsUsed),
  };
}

export async function recomputeOneFitCustomerCreditFields(
  userId: string,
  models: IModels,
): Promise<void> {
  const oneFitCustomer = await models.OneFitCustomer.getOneFitCustomer(userId);
  if (!oneFitCustomer) {
    return;
  }

  const balance = await models.CreditTransaction.getUserBalance(userId);
  const transactions = await models.CreditTransaction.find({ userId });
  const { totalCreditsEarned, totalCreditsUsed } =
    computeEarnedAndUsedFromTransactions(transactions);

  await models.OneFitCustomer.updateCreditTotals(
    userId,
    balance,
    totalCreditsEarned,
    totalCreditsUsed,
  );
}
