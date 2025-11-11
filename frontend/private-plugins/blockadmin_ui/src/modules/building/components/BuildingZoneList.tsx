import { IconTrash } from '@tabler/icons-react';
import { Button, CurrencyField, Spinner, toast, useConfirm } from 'erxes-ui';
import { InfoCard, InfoCardContent } from '@/block/components/card';
import {
  AddBuildingZone,
  GenerateByFloorRange,
} from '@/building/components/AddBuildingZone';
import { BLOCK_GET_BUILDING_ZONINGS } from '@/building/graphql/buildingQueries';
import {
  useBuildings,
  useBuildingZonings,
} from '@/building/hooks/useBuildings';
import { useBuildingZoningUpdate } from '@/building/hooks/useBuildingUpdate';
import { useBuildingZoningRemove } from '@/building/hooks/useBuildingZoningRemove';
import { IBuilding, IZoning } from '@/building/types/buildingTypes';
import { IProjectDetail } from '@/project/types/projectTypes';
import { SelectTenureType } from '@/unit/components/SelectTenureType';
import { SelectUsageType } from '@/unit/components/SelectUsageType';
import { useEffect, useState } from 'react';

export const BuildingZoneList = ({ project }: { project: IProjectDetail }) => {
  const { buildings, loading } = useBuildings({ projectId: project._id });
  if (loading) {
    return <Spinner containerClassName="py-32" />;
  }

  if (!buildings?.length) {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-center text-sm text-muted-foreground">
          No buildings found
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {buildings?.map((building) => (
        <BuildingZoneCard key={building._id} building={building} />
      ))}
    </div>
  );
};

export const BuildingZoneCard = ({ building }: { building: IBuilding }) => {
  const { buildingZonings, loading } = useBuildingZonings({
    buildingId: building._id,
  });
  return (
    <InfoCard
      title={`${building.name} • ${building.type} • ${buildingZonings?.length} floors`}
    >
      <InfoCardContent>
        {loading ? (
          <Spinner containerClassName="py-32" />
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2  2xl:grid-cols-4 gap-3">
            {buildingZonings?.map((zoning) => (
              <BuildingZone key={zoning._id} zoning={zoning} />
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <AddBuildingZone building={building} />
          <GenerateByFloorRange building={building} />
        </div>
      </InfoCardContent>
    </InfoCard>
  );
};

export const BuildingZone = ({ zoning }: { zoning: IZoning }) => {
  const { updateBuildingZoning } = useBuildingZoningUpdate({ id: zoning._id });
  const [zoningSize, setZoningSize] = useState(zoning.size);
  const { deleteBuildingZoning } = useBuildingZoningRemove();
  const { confirm } = useConfirm();

  useEffect(() => {
    if (zoning.size !== zoningSize) {
      setZoningSize(zoning.size);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoning.size]);

  return (
    <div className="p-4 rounded-lg bg-primary/10 border-primary/20 border">
      <div className="flex justify-between mb-4 items-center">
        <div className="font-medium text-left">
          {zoning.floor < 0 ? `B${zoning.floor * -1}` : zoning.floor}
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="bg-destructive/10 text-destructive hover:bg-destructive/20"
          onClick={() =>
            confirm({
              message: `Are you sure you want to delete the zoning on floor '${zoning.floor}'?`,
            }).then(() =>
              deleteBuildingZoning({
                variables: { id: zoning._id },
                onCompleted: () => {
                  toast({
                    title: 'Success',
                    description: `Zoning on floor '${
                      zoning.floor < 0 ? `B${zoning.floor * -1}` : zoning.floor
                    }' deleted successfully`,
                  });
                },
                onError: (e) => {
                  toast({
                    title: 'Error',
                    description: e.message,
                    variant: 'destructive',
                  });
                },
                refetchQueries: [
                  {
                    query: BLOCK_GET_BUILDING_ZONINGS,
                    variables: { building: zoning.building },
                  },
                ],
              }),
            )
          }
        >
          <IconTrash />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <SelectUsageType
          value={zoning.usageType}
          onValueChange={(value) => updateBuildingZoning({ usageType: value })}
        />
        <SelectTenureType
          value={zoning.tenureType}
          onValueChange={(value) => updateBuildingZoning({ tenureType: value })}
        />
        <CurrencyField.ValueInput
          value={zoningSize}
          className="col-span-2"
          placeholder="Size in m²"
          onChange={(value) => setZoningSize(value)}
          onBlur={() =>
            zoningSize !== zoning.size &&
            updateBuildingZoning({ size: zoningSize })
          }
        />
      </div>
    </div>
  );
};
