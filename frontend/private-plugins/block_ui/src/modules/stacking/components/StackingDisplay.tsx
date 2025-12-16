import {
  useBuildings,
  useBuildingZonings,
} from '@/building/hooks/useBuildings';
import { IZoning } from '@/building/types/buildingTypes';
import { useProjects } from '@/project/hooks/useProjects';
import { StackingUnitItem } from '@/stacking/components/StackingUnitItem';
import { UnitDetailSheet } from '@/unit/components/UnitDetailSheet';
import { UNIT_SALE_STATUS } from '@/unit/constants/unit';
import { useUnits } from '@/unit/hooks/useUnits';
import {
  IconBuildingPlus,
  IconClipboardText,
  IconPlus,
} from '@tabler/icons-react';
import { Button, ScrollArea, Spinner, useQueryState } from 'erxes-ui';
import { Link, useParams } from 'react-router-dom';

export const StackingDisplay = () => {
  const { projectId } = useParams();
  const [buildingId] = useQueryState<string>('buildingId');
  const { loading: projectsLoading } = useProjects(true);
  const { loading: buildingsLoading } = useBuildings({
    projectId: projectId ?? '',
  });
  const { buildingZonings, loading } = useBuildingZonings({
    buildingId,
  });

  if (projectsLoading || buildingsLoading) {
    return <Spinner containerClassName="blk:py-32" />;
  }

  if (!projectId) {
    return (
      <div className="p-4 flex-auto flex flex-col items-center justify-center gap-2">
        <IconClipboardText
          className="size-12 text-accent-foreground"
          strokeWidth={1}
        />
        <div className="text-sm text-muted-foreground">No project created</div>
        <Button variant="secondary" asChild className="mt-2">
          <Link to="/block/projects">
            <IconPlus />
            Create Project
          </Link>
        </Button>
      </div>
    );
  }

  if (!buildingId) {
    return (
      <div className="p-4 flex-auto flex flex-col items-center justify-center gap-2">
        <IconBuildingPlus
          className="size-12 text-accent-foreground"
          strokeWidth={1}
        />
        <div className="text-sm text-muted-foreground">No building created</div>
        <Button variant="secondary" asChild className="mt-2">
          <Link to={`/block/projects/${projectId}?activeTab=buildings`}>
            <IconPlus />
            Create Building
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 flex-auto overflow-hidden">
        <ScrollArea className="blk:bg-primary/5 h-full w-full shadow-xs p-3">
          <div className="flex flex-col gap-3">
            {!loading &&
              buildingZonings &&
              buildingZonings.length > 0 &&
              [...buildingZonings]
                .sort((a, b) => b.floor - a.floor)
                .map((zone) => <StackingZone key={zone._id} zone={zone} />)}
          </div>
          <ScrollArea.Bar orientation="horizontal" />
        </ScrollArea>
      </div>
      <StatusExplanation />
      <UnitDetailSheet />
    </>
  );
};

export const StackingZone = ({ zone }: { zone: IZoning }) => {
  const { units } = useUnits({
    variables: { zoning: zone._id },
  });

  const notUsedSizeByUnit = units?.reduce(
    (acc, { unitType, status }) =>
      !status || status === 'available' ? acc + unitType?.size : acc,
    0,
  );

  return (
    <div className="flex gap-3">
      <div className="sticky left-0 z-10 bg-background w-48 h-28 flex-none p-3 flex flex-col gap-1">
        <span className="font-bold">
          {zone.floor < 0 ? `B${zone.floor * -1}` : zone.floor}
        </span>
        <span className="text-xs">{units?.length} units</span>
        <span className="text-xs">{zone.size} m²</span>

        <span className="text-xs">vacant by size: {notUsedSizeByUnit} m²</span>
      </div>
      {units
        ?.filter((unit) => unit.unitType?.size > 0)
        .map((unit) => (
          <StackingUnitItem key={unit._id} {...unit} />
        ))}
    </div>
  );
};

export const StatusExplanation = () => {
  return (
    <div className="flex-none flex items-center justify-between gap-4 p-4 pt-0 text-xs">
      {Object.values(UNIT_SALE_STATUS).map((status) => (
        <div className="flex gap-2 items-center">
          <div
            className="size-4 rounded-full flex-none"
            style={{ backgroundColor: status.color }}
          />
          {status.mn}
        </div>
      ))}
    </div>
  );
};
