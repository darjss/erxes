import { BuildingsCard } from 'frontend/private-plugins/blockadmin_ui/src/modules/building/components/BuildingsCard';
import { useProjectDetail } from '../hooks/useProjectDetail';

export const ProjectDetailBuildings = () => {
  const { loading, project } = useProjectDetail();

  if (loading || !project) return null;

  return (
    <div className="p-8">
      <BuildingsCard project={project} />
    </div>
  );
};
