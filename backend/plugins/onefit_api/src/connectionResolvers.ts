import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';
import mongoose from 'mongoose';
import { MasterClient } from '~/utils/masterClient';
import { OneFitMode } from '~/constants/mode';

// Category
import { IActivityCategoryDocument } from '@/category/@types/category';
import {
  IActivityCategoryModel,
  loadActivityCategoryClass,
} from '@/category/db/models/Category';

// Activity Type
import { IActivityTypeDocument } from '@/activity-type/@types/activityType';
import {
  IActivityTypeModel,
  loadActivityTypeClass,
} from '@/activity-type/db/models/ActivityType';

// Provider
import { IProviderDocument } from '@/provider/@types/provider';
import {
  IProviderModel,
  loadProviderClass,
} from '@/provider/db/models/Provider';

// Schedule
import {
  IScheduleTemplateDocument,
  IScheduleExceptionDocument,
} from '@/schedule/@types/schedule';
import {
  IScheduleTemplateModel,
  IScheduleExceptionModel,
  loadScheduleTemplateClass,
  loadScheduleExceptionClass,
} from '@/schedule/db/models/Schedule';

// Membership
import { IMembershipPlanDocument } from '@/membership/@types/membership';
import {
  IMembershipPlanModel,
  loadMembershipPlanClass,
} from '@/membership/db/models/Membership';

// CreditTransaction
import { ICreditTransactionDocument } from '@/membership/@types/credittransaction';
import {
  ICreditTransactionModel,
  loadCreditTransactionClass,
} from '@/membership/db/models/CreditTransaction';

// MembershipPurchase
import { IMembershipPurchaseDocument } from '@/membership/@types/membershippurchase';
import {
  IMembershipPurchaseModel,
  loadMembershipPurchaseClass,
} from '@/membership/db/models/MembershipPurchase';

// Booking
import { IBookingDocument } from '@/booking/@types/booking';
import { IBookingModel, loadBookingClass } from '@/booking/db/models/Booking';

// Notification
import { INotificationDocument } from '@/notification/@types/notification';
import {
  INotificationModel,
  loadNotificationClass,
} from '@/notification/db/models/Notification';

// Config
import { ISystemConfigDocument } from '@/config/@types/config';
import {
  ISystemConfigModel,
  loadSystemConfigClass,
} from '@/config/db/models/Config';

// OneFitCustomer
import { IOneFitCustomerDocument } from '@/onefitCustomer/@types/onefitCustomer';
import {
  IOneFitCustomerModel,
  loadOneFitCustomerClass,
} from '@/onefitCustomer/db/models/OneFitCustomer';

export interface IModels {
  models: mongoose.Model<
    unknown,
    unknown,
    unknown,
    {},
    mongoose.Document<unknown, unknown, unknown> &
      Omit<{ _id: mongoose.Types.ObjectId } & { __v: number }, never>,
    IOneFitCustomerDocument
  >;
  ActivityCategory: IActivityCategoryModel;
  ActivityType: IActivityTypeModel;
  Provider: IProviderModel;
  ScheduleTemplate: IScheduleTemplateModel;
  ScheduleException: IScheduleExceptionModel;
  MembershipPlan: IMembershipPlanModel;
  CreditTransaction: ICreditTransactionModel;
  MembershipPurchase: IMembershipPurchaseModel;
  Booking: IBookingModel;
  Notification: INotificationModel;
  SystemConfig: ISystemConfigModel;
  OneFitCustomer: IOneFitCustomerModel;
}

export interface IContext extends IMainContext {
  models: IModels;
  subdomain: string;
  mode: OneFitMode;
  instanceId?: string;
  masterClient?: MasterClient;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.ActivityCategory = db.model<
    IActivityCategoryDocument,
    IActivityCategoryModel
  >('onefit_activity_categories', loadActivityCategoryClass(models));

  models.ActivityType = db.model<IActivityTypeDocument, IActivityTypeModel>(
    'onefit_activity_types',
    loadActivityTypeClass(models),
  );

  models.Provider = db.model<IProviderDocument, IProviderModel>(
    'onefit_providers',
    loadProviderClass(models),
  );

  models.ScheduleTemplate = db.model<
    IScheduleTemplateDocument,
    IScheduleTemplateModel
  >('onefit_schedule_templates', loadScheduleTemplateClass(models));

  models.ScheduleException = db.model<
    IScheduleExceptionDocument,
    IScheduleExceptionModel
  >('onefit_schedule_exceptions', loadScheduleExceptionClass(models));

  models.MembershipPlan = db.model<
    IMembershipPlanDocument,
    IMembershipPlanModel
  >('onefit_membership_plans', loadMembershipPlanClass(models));

  models.CreditTransaction = db.model<
    ICreditTransactionDocument,
    ICreditTransactionModel
  >('onefit_credit_transactions', loadCreditTransactionClass(models));

  models.MembershipPurchase = db.model<
    IMembershipPurchaseDocument,
    IMembershipPurchaseModel
  >('onefit_membership_purchases', loadMembershipPurchaseClass(models));

  models.Booking = db.model<IBookingDocument, IBookingModel>(
    'onefit_bookings',
    loadBookingClass(models),
  );

  models.Notification = db.model<INotificationDocument, INotificationModel>(
    'onefit_notifications',
    loadNotificationClass(models),
  );

  models.SystemConfig = db.model<ISystemConfigDocument, ISystemConfigModel>(
    'onefit_system_configs',
    loadSystemConfigClass(models),
  );
  models.OneFitCustomer = db.model<
    IOneFitCustomerDocument,
    IOneFitCustomerModel
  >('customers', loadOneFitCustomerClass(models));
  // models.OneFitCustomer.discriminator(
  //   'OneFitCustomer',
  //   loadOneFitCustomerClass(models),
  // );
  // console.log(models.OneFitCustomer);
  // console.log('OneFitCustomer', models.OneFitCustomer.collection.name);
  // console.log('OneFitCustomer', models.OneFitCustomer.discriminator);

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
