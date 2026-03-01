import { Resizable, useIsMobile } from 'erxes-ui';
import { useParams } from 'react-router-dom';
import { Agents } from './Agents';

export const AgentDetailsLayout = () => {
  const isMobile = useIsMobile();
  const { id } = useParams();

  if (isMobile) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        {id ? <Agents /> : <div />}
      </div>
    );
  }
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
        <Agents />
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel minSize={20} defaultSize={70}>
        <div />
      </Resizable.Panel>
    </Resizable.PanelGroup>
  );
};
