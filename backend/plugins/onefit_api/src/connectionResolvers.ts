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
import {
  IProviderDocument,
  ICityDocument,
  IDistrictDocument,
} from '@/provider/@types/provider';
import {
  IProviderModel,
  loadProviderClass,
} from '@/provider/db/models/Provider';
import {
  IProviderReviewDocument,
} from '@/provider/@types/providerReview';
import {
  IProviderReviewModel,
  loadProviderReviewClass,
} from '@/provider/db/models/ProviderReview';
import { ICityModel, loadCityClass } from '@/provider/db/models/City';
import {
  IDistrictModel,
  loadDistrictClass,
} from '@/provider/db/models/District';

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

// Banner
import { IBannerDocument } from '@/banner/@types/banner';
import { IBannerModel, loadBannerClass } from '@/banner/db/models/Banner';

// PromoCode
import { IPromoCodeDocument } from '@/promoCode/@types/promoCode';
import {
  IPromoCodeModel,
  loadPromoCodeClass,
} from '@/promoCode/db/models/PromoCode';

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
  ProviderReview: IProviderReviewModel;
  City: ICityModel;
  District: IDistrictModel;
  ScheduleTemplate: IScheduleTemplateModel;
  ScheduleException: IScheduleExceptionModel;
  MembershipPlan: IMembershipPlanModel;
  CreditTransaction: ICreditTransactionModel;
  MembershipPurchase: IMembershipPurchaseModel;
  Booking: IBookingModel;
  SystemConfig: ISystemConfigModel;
  OneFitCustomer: IOneFitCustomerModel;
  Banner: IBannerModel;
  PromoCode: IPromoCodeModel;
}

export interface IContext extends IMainContext {
  models: IModels;
  subdomain: string;
  mode: OneFitMode;
  instanceId?: string;
  masterClient?: MasterClient;
  masterUrl?: string;
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

  models.ProviderReview = db.model<
    IProviderReviewDocument,
    IProviderReviewModel
  >('onefit_provider_reviews', loadProviderReviewClass(models));

  models.City = db.model<ICityDocument, ICityModel>(
    'onefit_cities',
    loadCityClass(models),
  );

  models.District = db.model<IDistrictDocument, IDistrictModel>(
    'onefit_districts',
    loadDistrictClass(models),
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

  models.Banner = db.model<IBannerDocument, IBannerModel>(
    'onefit_banners',
    loadBannerClass(models),
  );

  models.PromoCode = db.model<IPromoCodeDocument, IPromoCodeModel>(
    'onefit_promo_codes',
    loadPromoCodeClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
