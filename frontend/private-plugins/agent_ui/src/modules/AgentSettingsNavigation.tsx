
import { SettingsNavigationMenuLinkItem, Sidebar } from 'erxes-ui';

export const AgentSettingsNavigation = () => {
  return (
    <Sidebar.Group>
      <Sidebar.GroupLabel className="h-4">agent</Sidebar.GroupLabel>
      <Sidebar.GroupContent className="pt-1">
        <Sidebar.Menu>
          <SettingsNavigationMenuLinkItem
            pathPrefix={"agent" + '/' + "agent"}
            path="agent"
            name="agent"
          />
          
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  );
};
