import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Empty, RecordTable } from 'erxes-ui';
import { IconCarSuv } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { createCarsColumns } from './CarsColumns';
import { CarsCommandBar } from './CarsCommandBar';
import { ICar } from '~/types/car';

const CarsRow = ({
  original,
  children,
  ...props
}: ComponentProps<typeof RecordTable.Row>) => {
  const navigate = useNavigate();

  return (
    <RecordTable.Row
      {...props}
      original={original}
      className="cursor-pointer"
      onClick={(event) => {
        const target = event.target as HTMLElement;

        if (
          target.closest(
            'a,button,input,[role="checkbox"],[data-radix-collection-item]',
          )
        ) {
          return;
        }

        if (original?._id) {
          navigate(`/car/${original._id}`);
        }
      }}
    >
      {children}
    </RecordTable.Row>
  );
};

export const CarsRecordTable = ({
  cars,
  loading,
  totalCount,
  sortField,
  sortDirection,
  onSort,
  onMergeSelected,
}: {
  cars: ICar[];
  loading: boolean;
  totalCount: number;
  sortField: string | null;
  sortDirection: number | null;
  onSort: (field: string) => void;
  onMergeSelected: (cars: ICar[]) => void;
}) => {
  const { t } = useTranslation('car');
  const columns = useMemo(
    () =>
      createCarsColumns({
        sortField,
        sortDirection,
        onSort,
        t,
      }),
    [onSort, sortDirection, sortField, t],
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <RecordTable.Provider
        columns={columns}
        data={cars}
        stickyColumns={['checkbox', 'plateNumber']}
        tableId="cars-record-table"
        className="m-3 mb-0 overflow-hidden rounded-xl border bg-sidebar/40"
      >
        <CarsCommandBar
          totalCount={totalCount}
          onMergeSelected={onMergeSelected}
        />
        {loading ? (
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowSkeleton rows={12} />
            </RecordTable.Body>
          </RecordTable>
        ) : cars.length ? (
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList Row={CarsRow} />
            </RecordTable.Body>
          </RecordTable>
        ) : (
          <div className="p-6">
            <Empty>
              <Empty.Header>
                <Empty.Media variant="icon">
                  <IconCarSuv />
                </Empty.Media>
                <Empty.Title>
                  {t('No cars found', { defaultValue: 'No cars found' })}
                </Empty.Title>
                <Empty.Description>
                  {t(
                    'Adjust filters or create a new car to start building the garage.',
                    {
                      defaultValue:
                        'Adjust filters or create a new car to start building the garage.',
                    },
                  )}
                </Empty.Description>
              </Empty.Header>
            </Empty>
          </div>
        )}
      </RecordTable.Provider>
    </div>
  );
};
