import { Input, Label, Select, Spinner, Textarea } from 'erxes-ui';
import {
  InfoCard,
  InfoCardContent,
} from 'frontend/private-plugins/blockadmin_ui/src/modules/block/components/card';
import { UploadImage } from 'frontend/private-plugins/blockadmin_ui/src/modules/block/components/upload';
import { AddBuilding } from 'frontend/private-plugins/blockadmin_ui/src/modules/building/components/AddBuilding';
import { useBuildings } from 'frontend/private-plugins/blockadmin_ui/src/modules/building/hooks/useBuildings';
import { useBuildingUpdate } from 'frontend/private-plugins/blockadmin_ui/src/modules/building/hooks/useBuildingUpdate';
import { IBuilding } from 'frontend/private-plugins/blockadmin_ui/src/modules/building/types/buildingTypes';
import { PROJECT_TYPES } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/constants/project';
import { IProjectDetail } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/types/projectTypes';
import { useState } from 'react';

export const BuildingsCard = ({ project }: { project: IProjectDetail }) => {
  const { buildings, loading } = useBuildings({ projectId: project._id });
  return (
    <InfoCard title="Buildings" description="Buildings">
      <InfoCardContent>
        <div className="grid grid-cols-12 gap-3">
          <Label asChild>
            <div className="px-2">Image</div>
          </Label>
          <Label asChild>
            <div className="px-2 col-span-3">Name</div>
          </Label>
          <Label asChild>
            <div className="px-2 col-span-2">Type</div>
          </Label>
          <Label asChild>
            <div className="px-2 col-span-4">Description</div>
          </Label>
          <Label asChild>
            <div className="px-2 col-span-2">Actions</div>
          </Label>
        </div>
        {loading ? (
          <Spinner containerClassName="py-32" />
        ) : (
          buildings?.map((building) => (
            <BuildingsCardItem key={building._id} building={building} />
          ))
        )}
        <AddBuilding project={project} />
      </InfoCardContent>
    </InfoCard>
  );
};

export const BuildingsCardItem = ({ building }: { building: IBuilding }) => {
  const { updateBuilding } = useBuildingUpdate({ id: building._id });
  const [name, setName] = useState(building.name);
  const [description, setDescription] = useState(building.description);
  return (
    <div className="grid grid-cols-12 gap-3">
      <UploadImage
        value={building.coverImage}
        onValueChange={(value) => updateBuilding({ coverImage: value })}
      />
      <div className="px-2 col-span-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => name !== building.name && updateBuilding({ name })}
          className="font-medium"
        />
      </div>
      <div className="px-2 col-span-2">
        <Select
          value={building.type}
          onValueChange={(value) => updateBuilding({ type: value })}
        >
          <Select.Trigger className="h-8">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {PROJECT_TYPES.map((type: string) => (
              <Select.Item key={type} value={type}>
                {type}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
      <div className="px-2 col-span-4">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() =>
            description !== building.description &&
            updateBuilding({ description })
          }
        />
      </div>
      <div className="px-2 col-span-2"></div>
    </div>
  );
};
