import { Model } from 'mongoose';
import { EventDispatcherReturn } from 'erxes-api-shared/core-modules';
import { IModels } from '~/connectionResolvers';
import { mushopSubscriptionPlanSchema } from '@/subscription/db/definitions/mushopSubscriptionPlan';
import { IMushopSubscriptionPlanDocument } from '@/subscription/@types/mushopSubscriptionPlan';
import {
  buildPlanCreatedLog,
  buildPlanUpdatedLog,
  buildPlanDeactivatedLog,
} from '~/meta/activity-log/mushopSubscriptionPlan';

export interface IMushopSubscriptionPlanModel
  extends Model<IMushopSubscriptionPlanDocument> {
  validateAndGet(
    planId: string,
    paidAmount: number,
    paidCurrency: string,
  ): Promise<IMushopSubscriptionPlanDocument>;
  createPlan(doc: {
    name: string;
    description?: string;
    price: number;
    currency?: string;
    durationMonths?: number;
  }): Promise<IMushopSubscriptionPlanDocument>;
  updatePlan(
    _id: string,
    doc: Partial<IMushopSubscriptionPlanDocument>,
  ): Promise<IMushopSubscriptionPlanDocument | null>;
  deactivatePlan(_id: string): Promise<IMushopSubscriptionPlanDocument | null>;
}

export const loadMushopSubscriptionPlanClass = (
  models: IModels,
  { createActivityLog }: EventDispatcherReturn,
) => {
  class MushopSubscriptionPlan {
    public static async validateAndGet(
      planId: string,
      paidAmount: number,
      paidCurrency: string,
    ) {
      const plan = await models.MushopSubscriptionPlan.findOne({
        _id: planId,
        isActive: true,
      }).lean();

      if (!plan) throw new Error(`Plan ${planId} not found or inactive`);

      if (plan.currency !== paidCurrency) {
        throw new Error(
          `Currency mismatch: plan expects ${plan.currency}, got ${paidCurrency}`,
        );
      }

      if (paidAmount < plan.price) {
        throw new Error(
          `Insufficient payment: plan requires ${plan.price} ${plan.currency}, got ${paidAmount}`,
        );
      }

      return plan;
    }

    public static async createPlan(doc: {
      name: string;
      description?: string;
      price: number;
      currency?: string;
      durationMonths?: number;
    }) {
      const plan = await models.MushopSubscriptionPlan.create({
        ...doc,
        isActive: true,
      });

      createActivityLog(buildPlanCreatedLog(plan));

      return plan;
    }

    public static async updatePlan(
      _id: string,
      doc: Partial<IMushopSubscriptionPlanDocument>,
    ) {
      const prev = await models.MushopSubscriptionPlan.findOne({ _id }).lean();
      if (!prev) throw new Error(`Plan ${_id} not found`);

      const updated = await models.MushopSubscriptionPlan.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );

      if (updated) {
        createActivityLog(
          buildPlanUpdatedLog(updated, {
            name: prev.name,
            price: prev.price,
            currency: prev.currency,
            durationMonths: prev.durationMonths,
            description: prev.description,
          }),
        );
      }

      return updated;
    }

    public static async deactivatePlan(_id: string) {
      const updated = await models.MushopSubscriptionPlan.findOneAndUpdate(
        { _id },
        { $set: { isActive: false } },
        { new: true },
      );

      if (updated) {
        createActivityLog(buildPlanDeactivatedLog(updated));
      }

      return updated;
    }
  }

  mushopSubscriptionPlanSchema.loadClass(MushopSubscriptionPlan);
  return mushopSubscriptionPlanSchema;
};
