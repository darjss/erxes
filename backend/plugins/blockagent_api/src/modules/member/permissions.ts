import { IPermissionConfig } from 'erxes-api-shared/core-types';

export const permissions: IPermissionConfig = {
  plugin: 'blockagent',

  modules: [
    {
      name: 'agent',
      description: 'Agent module permissions',
      scopeField: 'agencyId',
      ownerFields: ['createdBy', 'assignedTo'],

      scopes: [
        {
          name: 'own',
          description: 'Records user created or assigned to user',
        },
        {
          name: 'group',
          description: 'Records in user teams',
        },
        { name: 'all', description: 'All records' },
      ],

      actions: [
        {
          title: 'View agent records',
          name: 'agentRead',
          description: 'View agents',
          always: true,
        },
        {
          title: 'Create agent records',
          name: 'agentCreate',
          description: 'Create agents',
        },
        {
          title: 'Edit agent records',
          name: 'agentUpdate',
          description: 'Edit agent records',
        },
        {
          title: 'Delete agent records',
          name: 'agentRemove',
          description: 'Delete agent records',
        },
      ],
    },
    {
      name: 'member',
      description: 'Member module permissions',
      scopeField: 'agencyId',
      ownerFields: ['createdBy'],

      scopes: [
        {
          name: 'own',
          description: 'Members created by user',
        },
        {
          name: 'group',
          description: 'Members in user teams',
        },
        { name: 'all', description: 'All members' },
      ],

      actions: [
        {
          title: 'View members',
          name: 'memberView',
          description: 'View agency members',
          always: true,
        },
        {
          title: 'Create members',
          name: 'memberCreate',
          description: 'Add agency members',
        },
        {
          title: 'Edit members',
          name: 'memberUpdate',
          description: 'Edit agency members',
        },
        {
          title: 'Delete members',
          name: 'memberRemove',
          description: 'Remove agency members',
        },
      ],
    },
  ],
  defaultGroups: [
    {
      id: 'blockagent:admin',
      name: 'Blockagent Admin',
      description: 'Full access to Blockagent plugin',
      permissions: [
        {
          plugin: 'blockagent',
          module: 'agent',
          actions: ['agentRead', 'agentCreate', 'agentUpdate', 'agentRemove'],
          scope: 'all',
        },
        {
          plugin: 'blockagent',
          module: 'member',
          actions: ['memberView', 'memberCreate', 'memberUpdate', 'memberRemove'],
          scope: 'all',
        },
      ],
    },
    {
      id: 'blockagent:agent',
      name: 'Blockagent Agent',
      description: 'Standard agent with limited access',
      permissions: [
        {
          plugin: 'blockagent',
          module: 'agent',
          actions: ['agentRead', 'agentCreate', 'agentUpdate'],
          scope: 'own',
        },
        {
          plugin: 'blockagent',
          module: 'member',
          actions: ['memberView', 'memberCreate', 'memberUpdate'],
          scope: 'own',
        },
      ],
    },
    {
      id: 'blockagent:viewer',
      name: 'Blockagent Viewer',
      description: 'Read-only access to Blockagent plugin',
      permissions: [
        {
          plugin: 'blockagent',
          module: 'agent',
          actions: ['agentRead'],
          scope: 'all',
        },
        {
          plugin: 'blockagent',
          module: 'member',
          actions: ['memberView'],
          scope: 'all',
        },
      ],
    },
  ],
};
