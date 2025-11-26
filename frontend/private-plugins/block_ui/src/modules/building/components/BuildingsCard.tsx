import { InfoCard, InfoCardContent } from '@/block/components/card';
import { UploadImage } from '@/block/components/upload';
import { AddBuilding } from '@/building/components/AddBuilding';
import { useBuildings } from '@/building/hooks/useBuildings';
import { useBuildingUpdate } from '@/building/hooks/useBuildingUpdate';
import { IBuilding } from '@/building/types/buildingTypes';
import {
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPES,
} from '@/project/constants/project';
import { IProject, ProjectStatus } from '@/project/types/projectTypes';
import {
  DatePicker,
  Empty,
  Input,
  Label,
  Select,
  Spinner,
  Textarea,
} from 'erxes-ui';
import { useState } from 'react';

export const BuildingsCard = ({ project }: { project: IProject }) => {
  const { buildings, loading } = useBuildings({ projectId: project._id });
  return (
    <InfoCard title="Buildings" description="Buildings">
      <InfoCardContent>
        <div className="grid grid-cols-12 gap-3">
          <Label asChild>
            <div className="col-span-2">Image</div>
          </Label>
          <Label asChild>
            <div className="col-span-4">Information</div>
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
      <div className="col-span-2">
        <UploadImage
          value={building.coverImage}
          onValueChange={(value) => updateBuilding({ coverImage: value })}
        />
      </div>
      <div className="col-span-4 flex flex-col gap-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => name !== building.name && updateBuilding({ name })}
          className="font-medium"
        />
        <Select
          value={building.type}
          onValueChange={(value) => updateBuilding({ type: value })}
        >
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
        <Select
          value={building.status}
          onValueChange={(value) =>
            updateBuilding({ status: value as ProjectStatus })
          }
        >
          <Select.Trigger className="h-8">
            <Select.Value placeholder="Select status" />
          </Select.Trigger>
          <Select.Content>
            {PROJECT_STATUS_OPTIONS.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <div className="flex gap-2">
          <DatePicker
            mode="single"
            placeholder="Start date"
            value={
              building.startDate ? new Date(building.startDate) : undefined
            }
            onChange={(date) => {
              const dateValue = Array.isArray(date) ? date[0] : date;

              const newStart = dateValue ? new Date(dateValue) : undefined;

              updateBuilding({
                startDate: newStart,
              });
            }}
          />
          <DatePicker
            mode="single"
            placeholder="End date"
            value={building.endDate ? new Date(building.endDate) : undefined}
            onChange={(date) => {
              const dateValue = Array.isArray(date) ? date[0] : date;

              const newEnd = dateValue ? new Date(dateValue) : undefined;

              updateBuilding({
                endDate: newEnd,
              });
            }}
          />
        </div>
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
