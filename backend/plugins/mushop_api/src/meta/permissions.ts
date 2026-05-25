import { IPermissionConfig } from 'erxes-api-shared/core-types';

export const permissions: IPermissionConfig = {
  plugin: 'mushop',

  modules: [
    {
      name: 'subscription',
      description: 'Mushop subscriptions',
      scopeField: null,
      ownerFields: [],
      scopes: [{ name: 'all', description: 'All subscriptions' }],
      actions: [
        {
          title: 'View subscriptions',
          name: 'showMushopSubscriptions',
          description: 'List and view subscriber records',
          always: true,
        },
        {
          title: 'Cancel subscription',
          name: 'mushopCancelSubscription',
          description: 'Cancel any customer subscription',
        },
        {
          title: 'Grant subscription',
          name: 'mushopGrantSubscription',
          description: 'Manually grant or extend a subscription for a customer',
        },
      ],
    },
    {
      name: 'subscriptionPlan',
      description: 'Mushop subscription plans',
      scopeField: null,
      ownerFields: [],
      scopes: [{ name: 'all', description: 'All plans' }],
      actions: [
        {
          title: 'View plans',
          name: 'showMushopSubscriptionPlans',
          description: 'List and view subscription plans',
          always: true,
        },
        {
          title: 'Add plans',
          name: 'mushopSubscriptionPlanCreate',
          description: 'Create subscription plans',
        },
        {
          title: 'Edit plans',
          name: 'mushopSubscriptionPlanUpdate',
          description: 'Edit subscription plans',
        },
        {
          title: 'Deactivate plans',
          name: 'mushopSubscriptionPlanDeactivate',
          description: 'Deactivate subscription plans',
        },
      ],
    },
    {
      name: 'supplier',
      description: 'Mushop suppliers',
      scopeField: null,
      ownerFields: [],
      scopes: [{ name: 'all', description: 'All suppliers' }],
      actions: [
        {
          title: 'View suppliers',
          name: 'showMushopSuppliers',
          description: 'List and view suppliers',
          always: true,
        },
        {
          title: 'Update verification status',
          name: 'mushopUpdateSupplierVerificationStatus',
          description: 'Approve or reject supplier verification',
        },
        {
          title: 'Update supplier tier',
          name: 'mushopUpdateSupplierTier',
          description: 'Change supplier tier level',
        },
        {
          title: 'Update supplier POS',
          name: 'mushopUpdateSupplierPos',
          description: 'Assign or change the POS configuration for a supplier',
        },
        {
          title: 'Update supplier Mushop POS',
          name: 'mushopUpdateSupplierMushopPos',
          description: 'Assign or change the Mushop POS configuration for a supplier',
        },
      ],
    },
    {
      name: 'product',
      description: 'Mushop products',
      scopeField: null,
      ownerFields: [],
      scopes: [{ name: 'all', description: 'All products' }],
      actions: [
        {
          title: 'View products',
          name: 'showMushopProducts',
          description: 'List and view products',
          always: true,
        },
        {
          title: 'Update product status',
          name: 'mushopUpdateProductStatus',
          description: 'Change product status (approve / reject / etc.)',
        },
        {
          title: 'Bulk update product status',
          name: 'mushopBulkUpdateProductStatus',
          description: 'Change status for many products at once',
        },
        {
          title: 'Assign product category',
          name: 'mushopAssignProductCategory',
          description: 'Move a product to a different category',
        },
        {
          title: 'Remove products',
          name: 'mushopRemoveProduct',
          description: 'Delete individual products',
        },
        {
          title: 'Bulk remove products',
          name: 'mushopBulkRemoveProducts',
          description: 'Delete many products at once',
        },
      ],
    },
    {
      name: 'collective',
      description: 'Mushop collectives (co-shops)',
      scopeField: null,
      ownerFields: [],
      scopes: [{ name: 'all', description: 'All collectives' }],
      actions: [
        {
          title: 'View collectives',
          name: 'showMushopCollectives',
          description: 'List and view collectives',
          always: true,
        },
        {
          title: 'Create collective',
          name: 'mushopCreateCollective',
          description: 'Create a new collective',
        },
        {
          title: 'Update collective suppliers',
          name: 'mushopUpdateCollectiveSuppliers',
          description: 'Add or remove suppliers from a collective',
        },
        {
          title: 'Resync collective',
          name: 'mushopResyncCollective',
          description: 'Re-replicate collective products into the target SaaS',
        },
        {
          title: 'Remove collective',
          name: 'mushopRemoveCollective',
          description: 'Delete a collective',
        },
      ],
    },
  ],

  defaultGroups: [
    {
      id: 'mushop:admin',
      name: 'Mushop Admin',
      description: 'Full access to Mushop plugin',
      permissions: [
        {
          plugin: 'mushop',
          module: 'subscription',
          actions: [
            'showMushopSubscriptions',
            'mushopCancelSubscription',
            'mushopGrantSubscription',
          ],
          scope: 'all',
        },
        {
          plugin: 'mushop',
          module: 'subscriptionPlan',
          actions: [
            'showMushopSubscriptionPlans',
            'mushopSubscriptionPlanCreate',
            'mushopSubscriptionPlanUpdate',
            'mushopSubscriptionPlanDeactivate',
          ],
          scope: 'all',
        },
        {
          plugin: 'mushop',
          module: 'supplier',
          actions: [
            'showMushopSuppliers',
            'mushopUpdateSupplierVerificationStatus',
            'mushopUpdateSupplierTier',
            'mushopUpdateSupplierPos',
            'mushopUpdateSupplierMushopPos',
          ],
          scope: 'all',
        },
        {
          plugin: 'mushop',
          module: 'product',
          actions: [
            'showMushopProducts',
            'mushopUpdateProductStatus',
            'mushopBulkUpdateProductStatus',
            'mushopAssignProductCategory',
            'mushopRemoveProduct',
            'mushopBulkRemoveProducts',
          ],
          scope: 'all',
        },
        {
          plugin: 'mushop',
          module: 'collective',
          actions: [
            'showMushopCollectives',
            'mushopCreateCollective',
            'mushopUpdateCollectiveSuppliers',
            'mushopResyncCollective',
            'mushopRemoveCollective',
          ],
          scope: 'all',
        },
      ],
    },
    {
      id: 'mushop:operator',
      name: 'Mushop Operator',
      description:
        'Day-to-day moderation: approve products, verify suppliers, grant subscriptions',
      permissions: [
        {
          plugin: 'mushop',
          module: 'subscription',
          actions: ['showMushopSubscriptions', 'mushopGrantSubscription'],
          scope: 'all',
        },
        {
          plugin: 'mushop',
          module: 'subscriptionPlan',
          actions: ['showMushopSubscriptionPlans'],
          scope: 'all',
        },
        {
          plugin: 'mushop',
          module: 'supplier',
          actions: [
            'showMushopSuppliers',
            'mushopUpdateSupplierVerificationStatus',
          ],
          scope: 'all',
        },
        {
          plugin: 'mushop',
          module: 'product',
          actions: ['showMushopProducts', 'mushopUpdateProductStatus'],
          scope: 'all',
        },
        {
          plugin: 'mushop',
          module: 'collective',
          actions: ['showMushopCollectives'],
          scope: 'all',
        },
      ],
    },
    {
      id: 'mushop:viewer',
      name: 'Mushop Viewer',
      description: 'Read-only access to Mushop',
      permissions: [
        {
          plugin: 'mushop',
          module: 'subscription',
          actions: ['showMushopSubscriptions'],
          scope: 'all',
        },
        {
          plugin: 'mushop',
          module: 'subscriptionPlan',
          actions: ['showMushopSubscriptionPlans'],
          scope: 'all',
        },
        {
          plugin: 'mushop',
          module: 'supplier',
          actions: ['showMushopSuppliers'],
          scope: 'all',
        },
        {
          plugin: 'mushop',
          module: 'product',
          actions: ['showMushopProducts'],
          scope: 'all',
        },
        {
          plugin: 'mushop',
          module: 'collective',
          actions: ['showMushopCollectives'],
          scope: 'all',
        },
      ],
    },
  ],
};
