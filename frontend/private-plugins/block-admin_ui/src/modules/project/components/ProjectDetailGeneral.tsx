import {
  Combobox,
  Label,
  Popover,
  Textarea,
  Command,
  Badge,
  Button,
} from 'erxes-ui';
import { useProjectDetail } from '../hooks/useProjectDetail';
import { InfoCard, InfoCardContent } from '@/block/components/card';
import { useEffect, useState } from 'react';

import { PROJECT_TYPES } from '../constants/project';
import { ProjectAddress } from '@/project/components/ProjectAddress';
import { useDeveloperInfo } from '@/block/hooks/useDeveloperInfo';
import { Link } from 'react-router';
import { IconArrowUpRight } from '@tabler/icons-react';

export const ProjectDetailGeneral = () => {
  const { loading } = useProjectDetail();

  if (loading) return null;

  return (
    <div className="grid lg:grid-cols-3 flex-auto">
      <div className="col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <InfoCard title="Project Information" description="Project information">
          <InfoCardContent>
            <ProjectDeveloper />
            <ProjectTypes />
            <ProjectDescription />
          </InfoCardContent>
        </InfoCard>
        <ProjectAddress />
      </div>
      <div className="border-l min-h-full bg-background"></div>
    </div>
  );
};

export const ProjectDeveloper = () => {
  const { developerInfo } = useDeveloperInfo();

  return (
    <div className="space-y-2">
      <Label>Developer</Label>
      <Button
        variant="outline"
        className="flex w-full justify-start h-8 shadow-xs"
        asChild
      >
        <Link to="/settings/block">
          {developerInfo?.name}
          <IconArrowUpRight className="ml-auto" />
        </Link>
      </Button>
    </div>
  );
};

export const ProjectDescription = () => {
  const { project } = useProjectDetail();
  const [descriptionValue, setDescriptionValue] = useState(
    project?.description,
  );

  useEffect(() => {
    if (project?.description) {
      setDescriptionValue(project?.description);
    }
  }, [project?.description]);

  const onBlur = () => {
    if (descriptionValue !== project?.description) {
      // updateProjectGeneralInfo(id, { description: descriptionValue });
    }
  };

  return (
    <div className="space-y-2">
      <Label>Description</Label>
      <Textarea
        value={descriptionValue}
        onChange={(e) => setDescriptionValue(e.target.value)}
        onBlur={onBlur}
      />
    </div>
  );
};

export const ProjectTypes = () => {
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  return (
    <div className="space-y-2">
      <Label>Types</Label>
      <Popover>
        <Combobox.TriggerBase className="justify-start h-auto min-h-8 flex-wrap">
          {projectTypes.map((type) => (
            <Badge key={type} variant="secondary">
              {type}
            </Badge>
          ))}
        </Combobox.TriggerBase>
        <Combobox.Content>
          <Command>
            <Command.Input />
            <Command.List>
              {PROJECT_TYPES.map((type) => (
                <Command.Item
                  value={type}
                  key={type}
                  onSelect={() =>
                    setProjectTypes(
                      projectTypes.includes(type)
                        ? projectTypes.filter((t) => t !== type)
                        : [...projectTypes, type],
                    )
                  }
                >
                  {type}
                  <Combobox.Check checked={projectTypes.includes(type)} />
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Combobox.Content>
      </Popover>
    </div>
  );
};
