import { IconSandbox } from '@tabler/icons-react';


import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'btkadmin',
  icon: IconSandbox,
  modules: [
    {
      name: 'btkadmin',
      icon: IconSandbox,
      path: 'btkadmin',
      hasSettings: true,
      hasRelationWidget: false,
      hasFloatingWidget: false,
    },
  ],
};
