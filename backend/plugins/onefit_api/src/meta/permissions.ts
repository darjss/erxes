import {
  IPermissionConfig,
  IPermissionModule,
} from 'erxes-api-shared/core-types';

const scopes: IPermissionModule['scopes'] = [
  {
    name: 'own',
    description: 'Records owned by the user (reserved for future scope rules)',
  },
  {
    name: 'group',
    description:
      "Records in the user's teams (reserved for future scope rules)",
  },
  { name: 'all', description: 'All records' },
];

export const permissions: IPermissionConfig = {
  plugin: 'onefit',

  modules: [
    {
      name: 'activityType',
      description: 'Permissions for activity types',
      scopeField: null,
      ownerFields: [],
      scopes,
      actions: [
        {
          title: 'Manage activity types',
          name: 'activityTypeManage',
          description: 'Manage activity types',
        },
      ],
    },
    {
      name: 'banner',
      description: 'Permissions for banners',
      scopeField: null,
      ownerFields: [],
      scopes,
      actions: [
        {
          title: 'Manage banners',
          name: 'bannerManage',
          description: 'Manage banners',
        },
      ],
    },
    {
      name: 'booking',
      description: 'Permissions for bookings',
      scopeField: null,
      ownerFields: [],
      scopes,
      actions: [
        {
          title: 'Create bookings',
          name: 'bookingCreate',
          description: 'Create bookings',
        },
        {
          title: 'Cancel bookings',
          name: 'bookingCancel',
          description: 'Cancel bookings',
        },
        {
          title: 'Mark booking attendance',
          name: 'bookingMarkAttendance',
          description: 'Mark booking attendance',
        },
      ],
    },
    {
      name: 'category',
      description: 'Permissions for categories',
      scopeField: null,
      ownerFields: [],
      scopes,
      actions: [
        {
          title: 'Manage categories',
          name: 'categoryManage',
          description: 'Manage categories',
        },
      ],
    },
    {
      name: 'dashboard',
      description: 'Permissions for dashboard',
      scopeField: null,
      ownerFields: [],
      scopes,
      actions: [
        {
          title: 'View dashboard',
          name: 'dashboardRead',
          description: 'View dashboard',
          always: true,
        },
      ],
    },
    {
      name: 'membership',
      description: 'Permissions for membership plans and purchases',
      scopeField: null,
      ownerFields: [],
      scopes,
      actions: [
        {
          title: 'Manage membership plans',
          name: 'membershipManage',
          description: 'Manage membership plans',
        },
        {
          title: 'Manage membership purchases',
          name: 'membershipPurchaseManage',
          description: 'Manage membership purchases',
        },
      ],
    },
    {
      name: 'onefitCustomer',
      description: 'Permissions for Onefit customers',
      scopeField: null,
      ownerFields: [],
      scopes,
      actions: [
        {
          title: 'View Onefit customers',
          name: 'onefitCustomerRead',
          description: 'View Onefit customers',
          always: true,
        },
        {
          title: 'Manage Onefit customers',
          name: 'onefitCustomerManage',
          description: 'Manage Onefit customers',
        },
      ],
    },
    {
      name: 'promoCode',
      description: 'Permissions for promo codes',
      scopeField: null,
      ownerFields: [],
      scopes,
      actions: [
        {
          title: 'Manage promo codes',
          name: 'promoCodeManage',
          description: 'Manage promo codes',
          always: true,
        },
      ],
    },
    {
      name: 'provider',
      description: 'Permissions for providers',
      scopeField: null,
      ownerFields: [],
      scopes,
      actions: [
        {
          title: 'Create providers',
          name: 'providerCreate',
          description: 'Create providers',
        },
        {
          title: 'Edit providers',
          name: 'providerUpdate',
          description: 'Edit providers',
        },
        {
          title: 'Delete providers',
          name: 'providerRemove',
          description: 'Delete providers',
        },
      ],
    },
    {
      name: 'schedule',
      description: 'Permissions for schedules',
      scopeField: null,
      ownerFields: [],
      scopes,
      actions: [
        {
          title: 'Manage schedules',
          name: 'scheduleManage',
          description: 'Manage schedules',
        },
      ],
    },
    {
      name: 'transaction',
      description: 'Permissions for credit transactions',
      scopeField: null,
      ownerFields: [],
      scopes,
      actions: [
        {
          title: 'View credit transactions',
          name: 'transactionRead',
          description: 'View credit transactions',
          always: true,
        },
        {
          title: 'Create credit transactions',
          name: 'transactionCreate',
          description: 'Create credit transactions',
        },
        {
          title: 'Delete credit transactions',
          name: 'transactionRemove',
          description: 'Delete credit transactions',
        },
      ],
    },
  ],

  defaultGroups: [
    {
      id: 'onefit:admin',
      name: 'Onefit Admin',
      description: 'Full access to the Onefit plugin',
      permissions: [
        {
          plugin: 'onefit',
          module: 'activityType',
          actions: ['activityTypeManage'],
          scope: 'all',
        },
        {
          plugin: 'onefit',
          module: 'banner',
          actions: ['bannerManage'],
          scope: 'all',
        },
        {
          plugin: 'onefit',
          module: 'booking',
          actions: ['bookingCreate', 'bookingCancel', 'bookingMarkAttendance'],
          scope: 'all',
        },
        {
          plugin: 'onefit',
          module: 'category',
          actions: ['categoryManage'],
          scope: 'all',
        },
        {
          plugin: 'onefit',
          module: 'dashboard',
          actions: ['dashboardRead'],
          scope: 'all',
        },
        {
          plugin: 'onefit',
          module: 'membership',
          actions: ['membershipManage', 'membershipPurchaseManage'],
          scope: 'all',
        },
        {
          plugin: 'onefit',
          module: 'onefitCustomer',
          actions: ['onefitCustomerRead', 'onefitCustomerManage'],
          scope: 'all',
        },
        {
          plugin: 'onefit',
          module: 'promoCode',
          actions: ['promoCodeManage'],
          scope: 'all',
        },
        {
          plugin: 'onefit',
          module: 'provider',
          actions: ['providerCreate', 'providerUpdate', 'providerRemove'],
          scope: 'all',
        },
        {
          plugin: 'onefit',
          module: 'schedule',
          actions: ['scheduleManage'],
          scope: 'all',
        },
        {
          plugin: 'onefit',
          module: 'transaction',
          actions: [
            'transactionRead',
            'transactionCreate',
            'transactionRemove',
          ],
          scope: 'all',
        },
      ],
    },
    {
      id: 'onefit:viewer',
      name: 'Onefit Viewer',
      description: 'Read-only access across Onefit modules',
      permissions: [
        {
          plugin: 'onefit',
          module: 'dashboard',
          actions: ['dashboardRead'],
          scope: 'all',
        },
        {
          plugin: 'onefit',
          module: 'onefitCustomer',
          actions: ['onefitCustomerRead'],
          scope: 'all',
        },
        {
          plugin: 'onefit',
          module: 'transaction',
          actions: ['transactionRead'],
          scope: 'all',
        },
      ],
    },
  ],
};
