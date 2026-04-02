
import { IconBuildingCommunity } from '@tabler/icons-react';
import { lazy, Suspense } from 'react';
import { IUIConfig } from 'erxes-ui';

const BlockagentSettingsNavigation = lazy(() =>
  import('frontend/private-plugins/blockagency_ui/src/modules/BlockagentSettingsNavigation').then((module) => ({
    default: module.BlockagentSettingsNavigation,
  })),
);

const BlockagentNavigation = lazy(() =>
  import('frontend/private-plugins/blockagency_ui/src/modules/BlockagentNavigation').then((module) => ({
    default: module.BlockagentNavigation,
  })),
);


export const CONFIG: IUIConfig = {
  name: 'blockagent',
  path: 'blockagent',
  settingsNavigation: () => (
    <Suspense fallback={<div />}>
      <BlockagentSettingsNavigation />
    </Suspense>
  ),
  navigationGroup: {
    name: 'agency',
    icon: IconBuildingCommunity,
    content: () => (
      <Suspense fallback={<div />}>
        <BlockagentNavigation />
      </Suspense>
    ),
  },

  modules: [
    {
      name: 'agency',
      icon: IconBuildingCommunity,
      path: 'blockagent',
    },
  ],
};
