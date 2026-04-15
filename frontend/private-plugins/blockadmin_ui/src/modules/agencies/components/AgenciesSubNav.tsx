import { IconBriefcase, IconLayoutList } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import { cn } from 'erxes-ui';

const NAV_ITEMS = [
  {
    label: 'Agencies',
    path: '/blockadmin/agencies/agencies',
    icon: IconBriefcase,
  },
  {
    label: 'Listing',
    path: '/blockadmin/agencies/listing',
    icon: IconLayoutList,
  },
] as const;

export const AgenciesSubNav = () => {
  return (
    <nav className="flex items-center gap-1 px-6 py-1.5 border-b bg-background">
      {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={false}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
            )
          }
        >
          <Icon className="size-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
};
