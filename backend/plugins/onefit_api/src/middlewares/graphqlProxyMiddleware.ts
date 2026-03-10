import { Request, Response, NextFunction } from 'express';
import {
  isSlaveMode,
  getOneFitInstanceId,
  getOneFitSecret,
} from '~/constants/mode';
import { getMasterClient } from '~/utils/masterClient';
import { getSubdomain } from 'erxes-api-shared/utils';

/**
 * Operations that are proxied to master in slave mode.
 * Only booking, schedule, activity type, providers, and account statement.
 */
const PROXY_TO_MASTER_OPERATIONS = [
  // Booking
  'oneFitBookings',
  'oneFitBookingsCount',
  'oneFitBooking',
  'oneFitBookingByBookingId',
  'cpOneFitBookings',
  'cpOneFitBookingsCount',
  'cpOneFitBooking',
  'cpOneFitBookingByBookingId',
  'cpOneFitBookingCreate',
  'cpOneFitBookingCancel',
  'oneFitBookingMarkAttendance',
  // Schedule
  'oneFitScheduleTemplates',
  'oneFitScheduleTemplatesCount',
  'oneFitScheduleTemplate',
  'oneFitScheduleTemplateByProviderAndMonth',
  'oneFitScheduleCoverageSummary',
  'oneFitScheduleExceptions',
  'oneFitScheduleExceptionsCount',
  'oneFitScheduleException',
  'oneFitMonthAvailability',
  'oneFitDaySlots',
  'oneFitScheduleTemplateCreate',
  'oneFitScheduleTemplateUpdate',
  'oneFitScheduleTemplateCopyPreviousMonth',
  'oneFitScheduleTemplatesRemove',
  'oneFitScheduleExceptionCreate',
  'oneFitScheduleExceptionRemove',
  'oneFitScheduleExceptionsRemove',
  // Activity type
  'oneFitActivityTypes',
  'oneFitActivityTypesCount',
  'oneFitActivityType',
  'oneFitActivityTypesWithAvailability',
  'oneFitActivityTypeCreate',
  'oneFitActivityTypeUpdate',
  'oneFitActivityTypesRemove',
  // Providers, cities, districts
  'oneFitProviders',
  'oneFitProvidersCount',
  'oneFitProvider',
  'oneFitCities',
  'oneFitDistricts',
  'oneFitCitiesAdmin',
  'oneFitDistrictsAdmin',
  'oneFitProviderCreate',
  'oneFitProviderUpdate',
  'oneFitProvidersRemove',
  // Account statement
  'oneFitAccountStatement',
  'oneFitCreditConsumption',

  //Categories
  'oneFitActivityCategories',
  'oneFitActivityCategoriesCount',
  'oneFitActivityCategory',

  'oneFitCustomers',
  'oneFitCustomer',
  'oneFitCustomersCount',
  'oneFitCustomersByCompanyId',
];

/** Operations that must never run locally in slave mode; these return 403. */
const BLOCKED_IN_SLAVE = [
  'oneFitSystemConfigUpdateSelectedPayments',
  'oneFitCreditTransactionsRemove',
  'oneFitCreditTransactionCreate',
  'oneFitCreditTransactionsBulkCreate',
  'oneFitCustomerUpdateCreditBalance',
  'oneFitCreditTransactions',
  'oneFitCreditTransactionsCount',
  'oneFitCreditTransaction',
  'oneFitUserCreditBalance',
  'oneFitUserCreditTransactions',
  'oneFitMembershipPlans',
  'oneFitMembershipPlansCount',
  'oneFitMembershipPlan',
  'oneFitActiveMembershipPlans',
  'oneFitMembershipPurchases',
  'oneFitMembershipPurchase',
  'cpOneFitMembershipPurchases',
  'cpOneFitMembershipPurchase',
  'oneFitMembershipPlanCreate',
  'oneFitMembershipPlanUpdate',
  'oneFitMembershipPlansRemove',
  'oneFitMembershipPurchaseCreate',
  'oneFitMembershipPurchaseActivate',
  'cpOneFitMembershipPurchaseCreate',
  'cpOneFitMembershipPurchaseActivate',
  'cpOneFitMembershipHoldStart',
  'cpOneFitMembershipHoldCancel',
  'cpOneFitMembershipCheckPromoDiscount',
  'oneFitBanners',
  'oneFitBannersCount',
  'oneFitBanner',
  'oneFitBannerCreate',
  'oneFitBannerUpdate',
  'oneFitBannersRemove',
  'oneFitPromoCodes',
  'oneFitPromoCodesCount',
  'oneFitPromoCode',
  'oneFitPromoCodeCreate',
  'oneFitPromoCodeUpdate',
  'oneFitPromoCodesRemove',
  'oneFitActivityCategoryCreate',
  'oneFitActivityCategoryUpdate',
  'oneFitActivityCategoriesRemove',
  'oneFitCityCreate',
  'oneFitCityUpdate',
  'oneFitCityRemove',
  'oneFitDistrictCreate',
  'oneFitDistrictUpdate',
  'oneFitDistrictRemove',
];

const isOperationInList = (
  query: string,
  operationName: string | undefined,
  list: string[],
): boolean => {
  if (operationName && list.includes(operationName)) {
    return true;
  }
  for (const op of list) {
    const regex = new RegExp(`\\b${op}\\b`, 'i');
    if (regex.test(query)) {
      return true;
    }
  }
  return false;
};

/**
 * Middleware that intercepts GraphQL requests in slave mode.
 * Blocked operations return 403. Whitelisted operations are proxied to master.
 * All other operations (config, introspection, etc.) run locally.
 */
export const graphqlProxyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Only intercept GraphQL requests
  if (req.path !== '/graphql' || req.method !== 'POST') {
    return next();
  }

  // Only proxy in slave mode
  if (!isSlaveMode()) {
    return next();
  }

  try {
    // Get the GraphQL request body
    const { query, variables, operationName } = req.body;

    if (!query) {
      return next();
    }

    // Blocked operations: return 403, do not proxy and do not run locally
    if (isOperationInList(query, operationName, BLOCKED_IN_SLAVE)) {
      return res.json({
        data: null,
        errors: [
          {
            message: 'OPERATION_NOT_ALLOWED_IN_SLAVE_MODE',
            extensions: { code: 'FORBIDDEN' },
          },
        ],
      });
    }

    // Only proxy whitelisted operations; everything else runs locally
    if (!isOperationInList(query, operationName, PROXY_TO_MASTER_OPERATIONS)) {
      return next();
    }

    const subdomain = getSubdomain(req);
    const instanceId = await getOneFitInstanceId(subdomain);

    if (!instanceId) {
      return res.status(503).json({
        data: null,
        errors: [
          {
            message: 'SLAVE_MODE_INSTANCE_ID_REQUIRED',
            extensions: { code: 'SERVICE_UNAVAILABLE' },
          },
        ],
      });
    }

    const masterClient = getMasterClient();

    // Forward headers for authentication and context
    const headers: Record<string, string> = {};

    // Forward important headers
    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization as string;
    }
    if (req.headers['x-subdomain']) {
      headers['x-subdomain'] = req.headers['x-subdomain'] as string;
    } else if (subdomain) {
      headers['x-subdomain'] = subdomain;
    }

    // Build cookie string
    const cookies: string[] = [];

    // Add onefitSecret as auth-token cookie
    const onefitSecret = getOneFitSecret();
    if (onefitSecret) {
      cookies.push(`auth-token=${onefitSecret}`);
    }

    // Set combined cookie header
    if (cookies.length > 0) {
      headers.cookie = cookies.join('; ');
    }

    // Add instanceId header so master knows which slave is making the request
    if (instanceId) {
      headers['x-onefit-instance-id'] = instanceId;
    }

    // Forward other relevant headers
    if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type'] as string;
    }

    // Forward the GraphQL request to master
    const result = await masterClient.request(
      {
        query,
        variables: variables || {},
        operationName,
      },
      headers,
    );

    // Return the master's response (including errors if any)
    const { data, errors } = result;
    if (errors?.some((error: any) => error.message === 'Login required')) {
      return res.json({
        ...data,
        errors: [
          {
            message: 'INVALID ONEFIT AUTHENTICATION',
          },
        ],
      });
    }
    return res.json(result);
  } catch (error: any) {
    console.error('Master proxy failed:', error?.message);
    return res.status(503).json({
      data: null,
      errors: [
        {
          message: 'SLAVE_MODE_MASTER_UNAVAILABLE',
          extensions: { code: 'SERVICE_UNAVAILABLE' },
        },
      ],
    });
  }
};
