import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  Button,
  Combobox,
  Command,
  Popover,
  SelectTree,
  TextOverflowTooltip,
} from 'erxes-ui';
import { IconTopologyStar3, IconX } from '@tabler/icons-react';
import { SEGMENTS } from 'ui-modules/modules/segments/graphql/queries';
import { generateOrderPath } from 'ui-modules/modules/segments/utils/segmentsUtils';
import { useTranslation } from 'react-i18next';

import { CAR_SEGMENT_CONTENT_TYPE } from '~/lib/constants';
import { ISegment } from '~/types/car';

export const SegmentFilter = ({
  value,
  onValueChange,
}: {
  value: string | null;
  onValueChange: (value: string | null) => void;
}) => {
  const { t } = useTranslation('car');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data, loading, error } = useQuery<{ segments: ISegment[] }>(
    SEGMENTS,
    {
      variables: {
        contentTypes: [CAR_SEGMENT_CONTENT_TYPE],
        searchValue: search || undefined,
        ids: value ? [value] : undefined,
      },
    },
  );

  const orderedSegments = useMemo(
    () => generateOrderPath(data?.segments || []),
    [data?.segments],
  );

  const selectedSegment = orderedSegments.find(
    (segment) => segment._id === value,
  );

  return (
    <SelectTree.Provider id="cars-segment-filter" ordered>
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="max-w-64 justify-start"
          >
            <IconTopologyStar3 className="size-4" />
            {selectedSegment ? (
              <TextOverflowTooltip
                value={selectedSegment.name}
                className="truncate"
              />
            ) : (
              t('Segment', { defaultValue: 'Segment' })
            )}
          </Button>
        </Popover.Trigger>
        <Combobox.Content className="w-80 p-0">
          <Command shouldFilter={false}>
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder={t('Search segment', {
                defaultValue: 'Search segment',
              })}
              variant="secondary"
              focusOnMount
            />
            <Command.List className="p-1">
              <Combobox.Empty loading={loading} error={error} />
              <Command.Item
                value="all-segments"
                onSelect={() => {
                  onValueChange(null);
                  setOpen(false);
                }}
              >
                {t('All segments', { defaultValue: 'All segments' })}
              </Command.Item>
              {orderedSegments.map((segment: any) => (
                <SelectTree.Item
                  key={segment._id}
                  _id={segment._id}
                  order={segment.order}
                  hasChildren={segment.hasChildren}
                  name={segment.name}
                  value={segment._id}
                  onSelect={() => {
                    onValueChange(segment._id);
                    setOpen(false);
                  }}
                  selected={value === segment._id}
                >
                  <div className="flex items-center gap-2 flex-auto overflow-hidden">
                    <TextOverflowTooltip
                      value={segment.name}
                      className="flex-auto"
                    />
                    <Combobox.Check checked={value === segment._id} />
                  </div>
                </SelectTree.Item>
              ))}
            </Command.List>
          </Command>
        </Combobox.Content>
      </Popover>
      {value ? (
        <Button variant="ghost" size="icon" onClick={() => onValueChange(null)}>
          <IconX className="size-4" />
        </Button>
      ) : null}
    </SelectTree.Provider>
  );
};
