import { useMemo } from 'react';
import {
  IconLinkPlus,
  IconTrash,
  IconVersions,
  IconX,
} from '@tabler/icons-react';
import { Button, Combobox, Badge, useConfirm, RecordTable } from 'erxes-ui';
import { TagsSelect } from 'ui-modules';
import { useTranslation } from 'react-i18next';

import { ROOT_CAR_CONTENT_TYPE } from '~/lib/constants';
import { useCarMutations } from '~/hooks/useCarMutations';
import { ICar } from '~/types/car';

export const CarsCommandBar = ({
  totalCount,
  onMergeSelected,
}: {
  totalCount: number;
  onMergeSelected: (cars: ICar[]) => void;
}) => {
  const { t } = useTranslation('car');
  const { table } = RecordTable.useRecordTable();
  const { confirm } = useConfirm();
  const { carsRemove, loading } = useCarMutations();

  const selectedCars = table
    .getSelectedRowModel()
    .rows.map((row) => row.original as ICar);
  const selectedIds = selectedCars.map((car) => car._id);

  const selectedTagIds = useMemo(
    () =>
      Array.from(
        new Set(
          selectedCars.flatMap((car) => car.tagIds || []).filter(Boolean),
        ),
      ),
    [selectedCars],
  );

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    await confirm({
      message:
        selectedIds.length === 1
          ? t('Delete the selected car?', {
              defaultValue: 'Delete the selected car?',
            })
          : t('Delete {{count}} selected cars?', {
              count: selectedIds.length,
              defaultValue: 'Delete {{count}} selected cars?',
            }),
      options: {
        variant: 'destructive',
        okLabel: t('Delete', { defaultValue: 'Delete' }),
      },
    });

    await carsRemove({
      variables: {
        carIds: selectedIds,
      },
    });

    table.toggleAllPageRowsSelected(false);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-sidebar/40 px-3 py-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">
          {selectedIds.length
            ? t('Selected count', {
                count: selectedIds.length,
                defaultValue: '{{count}} selected',
              })
            : t('cars count', {
                count: totalCount,
                defaultValue: '{{count}} cars',
              })}
        </Badge>
        {selectedIds.length ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => table.toggleAllPageRowsSelected(false)}
          >
            <IconX className="size-4" />
            {t('Clear selection', { defaultValue: 'Clear selection' })}
          </Button>
        ) : null}
      </div>

      {selectedIds.length ? (
        <div className="flex flex-wrap items-center gap-2">
          <TagsSelect.Provider
            mode="multiple"
            type={ROOT_CAR_CONTENT_TYPE}
            targetIds={selectedIds}
            value={selectedTagIds}
            options={() => ({
              refetchQueries: [
                'CarsMain',
                'Cars',
                'CarDetail',
                'CarCountByTags',
              ],
            })}
          >
            <TagsSelect.Trigger
              variant="secondary"
              size="sm"
              placeholder={t('Assign tags', { defaultValue: 'Assign tags' })}
            />
            <Combobox.Content className="w-80">
              <TagsSelect.Content />
            </Combobox.Content>
          </TagsSelect.Provider>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={selectedIds.length !== 2}
            onClick={() => onMergeSelected(selectedCars)}
          >
            <IconVersions className="size-4" />
            {t('Merge', { defaultValue: 'Merge' })}
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={handleDelete}
          >
            <IconTrash className="size-4" />
            {t('Delete', { defaultValue: 'Delete' })}
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <IconLinkPlus className="size-4" />
          {t('Select rows to merge, tag, or delete cars.', {
            defaultValue: 'Select rows to merge, tag, or delete cars.',
          })}
        </div>
      )}
    </div>
  );
};
