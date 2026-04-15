import { Separator } from 'erxes-ui';
import { UnitKPI } from '~/modules/unit/components/UnitKPI';
import { UnitRecordTable } from '~/modules/unit/components/UnitRecordTable';

export const UnitIndexPage = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <UnitKPI />
      <Separator />
      <UnitRecordTable />
    </div>
  );
};
