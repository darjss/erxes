import { ProjectCard } from './ProjectCard';
import { useProjects } from '../hooks/useProjects';
import { Spinner } from 'erxes-ui';

export const Projects = () => {
  const { projects, loading } = useProjects();

  if (loading) {
    return <Spinner containerClassName="blk:py-32" />;
  }

  return (
    <div className="grid grid-cols-1 blk:lg:grid-cols-2 blk:xl:grid-cols-3 gap-6 p-8">
      {projects?.map((project) => (
        <ProjectCard key={project._id} {...project} />
      ))}
    </div>
  );
};
