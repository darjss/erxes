import { InfoCard, InfoCardContent } from '@/btk/components/card';
import { Input, Label, Select, Spinner, Textarea } from 'erxes-ui';
import { IProjectDetail } from '@/project/types/projectTypes';
import { useBuildings } from '@/building/hooks/useBuildings';
import { AddBuilding } from '@/building/components/AddBuilding';
import { IBuilding } from '@/building/types/buildingTypes';
import { UploadImage } from '@/btk/components/upload';
import { useBuildingUpdate } from '@/building/hooks/useBuildingUpdate';
import { useState } from 'react';
import { PROJECT_TYPES } from '@/project/constants/project';

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
