import {
  Breadcrumb,
  Button,
  Sheet,
  FocusSheet,
  Spinner,
  useMultiQueryState,
  useQueryState,
} from 'erxes-ui';
import { UnitSidebar } from '@/unit/components/UnitSidebar';
import { UnitTabs } from '@/unit/components/UnitTabs';
import { useUnit } from '@/unit/hooks/useUnit';
import { UnitContext } from '@/unit/context/unitContext';
import { RelationWidgetSideTabs } from 'ui-modules';

export const UnitDetailSheet = () => {
  const [{ unitId }, setQueries] = useMultiQueryState<{
    unitId: string;
    activeUnitTab: string;
  }>(['unitId', 'activeUnitTab']);

  return (
    <FocusSheet
      open={!!unitId}
      onOpenChange={() => setQueries({ unitId: null, activeUnitTab: null })}
    >
      <FocusSheet.View className="sm:w-full sm:max-w-7xl">
        {unitId && <UnitDetailSheetContent />}
      </FocusSheet.View>
    </FocusSheet>
  );
};

export const UnitDetailSheetContent = () => {
  const [unitId] = useQueryState<string>('unitId');

  const { unit, loading } = useUnit(unitId);

  if (loading) {
    return <Spinner containerClassName="h-full" />;
  }

  const zoneFloor = unit?.zoningData?.floor;

  return (
    <>
      <FocusSheet.Header title={''}>
        <Breadcrumb>
          <Breadcrumb.List>
            {unit?.projectData && (
              <>
                <Button variant="ghost" asChild>
                  <Breadcrumb.Item>{unit?.projectData?.name}</Breadcrumb.Item>
                </Button>
                <Breadcrumb.Separator />
              </>
            )}
            {unit?.buildingData && (
              <>
                <Button variant="ghost" asChild>
                  <Breadcrumb.Item>{unit?.buildingData?.name}</Breadcrumb.Item>
                </Button>
                <Breadcrumb.Separator />
              </>
            )}

            {unit?.zoningData?.floor && (
              <>
                <Button variant="ghost" asChild>
                  <Breadcrumb.Item>
                    {zoneFloor !== undefined
                      ? `Floor ${zoneFloor < 0 ? `B${-zoneFloor}` : zoneFloor}`
                      : 'Floor N/A'}
                  </Breadcrumb.Item>
                </Button>
                <Breadcrumb.Separator />
              </>
            )}

            <Button variant="ghost" asChild>
              <Breadcrumb.Page>{unit?.number}</Breadcrumb.Page>
            </Button>
          </Breadcrumb.List>
        </Breadcrumb>
      </FocusSheet.Header>

      <FocusSheet.Content className="flex flex-auto overflow-hidden">
        <FocusSheet.SideBar>
          <UnitSidebar />
        </FocusSheet.SideBar>

        <UnitContext.Provider value={{ unit }}>
          <div className='flex-1'>
            {!!unitId && <UnitTabs />}
          </div>

          <RelationWidgetSideTabs
            contentId={unitId || ''}
            contentType="block:unit"
            access={{ oppty: "read" }}
            hookOptions={{
              hiddenPlugins: ['sales', 'frontline', 'core', 'operation'],
            }}
          />
        </UnitContext.Provider>
      </FocusSheet.Content>
    </>
  );
};
