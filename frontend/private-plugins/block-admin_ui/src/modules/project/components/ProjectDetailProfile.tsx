import { IconClockFilled, IconShieldFilled } from '@tabler/icons-react';
import { Badge, cn, Spinner } from 'erxes-ui';
import { ProjectDetailActions } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/components/ProjectDetailActions';
import { useProjectDetail } from '../hooks/useProjectDetail';
import { ProjectDetailName } from './ProjectDetailName';

export const ProjectDetailProfile = () => {
  const { project, loading } = useProjectDetail();

  if (loading) return <Spinner containerClassName="py-12" />;

  return (
    <div className="flex border-b">
      <div className="p-8 space-y-3">
        <div className="flex items-center gap-3">
          <ProjectDetailName
            id={project?._id || ''}
            name={project?.name || ''}
          />
          <Badge
            variant={project?.status === 'verified' ? 'default' : 'secondary'}
          >
            <IconShieldFilled
              className={cn(
                'size-3.5',
                project?.status !== 'verified' && 'text-accent-foreground',
              )}
            />
            {project?.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-accent-foreground">
          <IconClockFilled className="size-4" />
          <p className="text-sm">Last updated by Carl Marx, 2024-12-01 14:30</p>
        </div>
      </div>
      <div className="ml-auto p-8">
        <ProjectDetailActions />
      </div>
    </div>
  );
};
