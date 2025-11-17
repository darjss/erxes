import { PROJECT_TABS } from '@/project/constants/project';
import { Separator, Sidebar, useQueryState } from 'erxes-ui';

export const ProjectDetailSidebar = () => {
  const [activeTab, setActiveTab] = useQueryState('activeTab', {
    defaultValue: 'general',
  });
  const properties = [
    PROJECT_TABS.GENERAL,
    PROJECT_TABS.AMENITIES,
    PROJECT_TABS.MEMBERS,
  ];

  const cmsTabs = [
    PROJECT_TABS.MEDIA,
    PROJECT_TABS.SEO,
    PROJECT_TABS.POLICIES,
    PROJECT_TABS.DOCUMENTS,
  ];

  return (
    <Sidebar
      collapsible="none"
      className="border-r flex-none [--sidebar-width:200px]"
    >
      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Sidebar.GroupLabel>Btk Admin</Sidebar.GroupLabel>
          <Sidebar.Menu>
            {properties.map((tab) => (
              <Sidebar.MenuItem key={tab}>
                <Sidebar.MenuButton
                  isActive={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className="capitalize"
                >
                  {tab}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            ))}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
      <Separator />
      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Sidebar.GroupLabel>Content Management</Sidebar.GroupLabel>
          <Sidebar.Menu>
            {cmsTabs.map((tab) => (
              <Sidebar.MenuItem key={tab}>
                <Sidebar.MenuButton
                  isActive={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className="capitalize"
                >
                  {tab}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            ))}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar>
  );
};
