import { NEWS_TABS } from '~/modules/news/constants/news';
import { Separator, Sidebar, useQueryState } from 'erxes-ui';

export const NewsDetailSidebar = () => {
  const [activeTab, setActiveTab] = useQueryState('activeTab', {
    defaultValue: 'general',
  });
  const properties = [
    NEWS_TABS.GENERAL,
    NEWS_TABS.AMENITIES,
    NEWS_TABS.MEMBERS,
  ];

  const cmsTabs = [
    NEWS_TABS.MEDIA,
    NEWS_TABS.SEO,
    NEWS_TABS.POLICIES,
    NEWS_TABS.DOCUMENTS,
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
