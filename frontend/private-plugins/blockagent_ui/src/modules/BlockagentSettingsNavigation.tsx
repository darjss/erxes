
import { SettingsNavigationMenuLinkItem, Sidebar } from 'erxes-ui';

export const BlockagentSettingsNavigation = () => {
  return (
    <Sidebar.Group>
      <Sidebar.GroupLabel className="h-4">blockagent</Sidebar.GroupLabel>
      <Sidebar.GroupContent className="pt-1">
        <Sidebar.Menu>
          <SettingsNavigationMenuLinkItem
            pathPrefix={"blockagent" + '/' + "blockagent"}
            path="blockagent"
            name="blockagent"
          />
          
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  );
};
