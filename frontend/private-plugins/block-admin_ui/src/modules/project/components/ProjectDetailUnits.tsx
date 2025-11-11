import { BuildingUnitsByZones } from 'frontend/private-plugins/blockadmin_ui/src/modules/building/components/BuildingZones';
import { UnitDetailSheet } from 'frontend/private-plugins/blockadmin_ui/src/modules/unit/components/UnitDetailSheet';
import { useParams } from 'react-router-dom';

export const ProjectDetailUnits = () => {
  const { id: projectId } = useParams();
  return (
    <>
      <BuildingUnitsByZones projectId={projectId} />
      <UnitDetailSheet />
    </>
  );
};
