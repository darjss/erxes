import { Resizable } from 'erxes-ui';

import { Agents } from './Agents';
import { AgentContent } from './AgentContent';
import { useState } from 'react';

export const AgentDetailsLayout = () => {
  const [selectedId, setSelectedId] = useState<string | null>('main');

  return (
    <Resizable.PanelGroup
      direction="horizontal"
      className="flex-1 overflow-hidden"
    >
      <Resizable.Panel
        minSize={20}
        defaultSize={20}
        className="hidden sm:flex min-w-80 max-w-lg"
      >
        <Agents selectedId={selectedId} setSelectedId={setSelectedId} />
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel minSize={20} defaultSize={70}>
        <AgentContent selectedId={selectedId} />
      </Resizable.Panel>
    </Resizable.PanelGroup>
  );
};
