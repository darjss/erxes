import { InfoCard, InfoCardContent } from '@/block/components/card';
import { UploadImage } from '@/block/components/upload';
import { useBuildings } from '@/building/hooks/useBuildings';
import { useBuildingUpdate } from '@/building/hooks/useBuildingUpdate';
import { IBuilding } from '@/building/types/buildingTypes';
import { PROJECT_TYPES } from '@/project/constants/project';
import { IProject } from '@/project/types/projectTypes';
import { Empty, Input, Label, Select, Spinner, Textarea } from 'erxes-ui';
import { useState } from 'react';

export const BuildingsCard = ({ project }: { project: IProject }) => {
  const { buildings, loading } = useBuildings({ projectId: project._id });
  return (
    <InfoCard title="Buildings" description="Buildings">
      <InfoCardContent>
        <div className="grid grid-cols-12 gap-3">
          <Label asChild>
            <div className="px-2">Image</div>
          </Label>
          <Label asChild>
            <div className="col-span-5">Information</div>
          </Label>
          <Label asChild>
            <div className="col-span-6">Description</div>
          </Label>
        </div>
        {loading ? (
          <Spinner containerClassName="blk:py-32" />
        ) : buildings?.length === 0 ? (
          <Empty>
            <Empty.Header>
              <Empty.Title>No buildings found</Empty.Title>
              <Empty.Description>
                There seems to be no buildings.
              </Empty.Description>
            </Empty.Header>
          </Empty>
        ) : (
          buildings?.map((building) => (
            <BuildingsCardItem key={building._id} building={building} />
          ))
        )}
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
      <UploadImage className="max-h-48" value={building.coverImage} />
      <div className="col-span-5 flex flex-col gap-3">
        <Input value={name} className="font-medium" />
        <Select value={building.type}>
          <Select.Trigger className="h-8">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {PROJECT_TYPES.map((type) => (
              <Select.Item key={type.value} value={type.value}>
                {type.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
      <div className="col-span-6 flex">
        <Textarea
          className="flex-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() =>
            description !== building.description &&
            updateBuilding({ description })
          }
        />
      </div>
    </div>
  );
};
