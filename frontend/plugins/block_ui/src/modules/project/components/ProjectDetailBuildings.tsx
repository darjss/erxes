import { useProjectDetail } from '../hooks/useProjectDetail';
import { BuildingsCard } from '@/building/components/BuildingsCard';

export const ProjectDetailBuildings = () => {
  const { loading, project } = useProjectDetail();

  if (loading || !project) return null;

  return (
    <div className="p-8">
      <BuildingsCard project={project} />
    </div>
  );
};
