import { Combobox, Command, Filter, PageSubHeader, useQueryState } from 'erxes-ui';

const SUBMISSION_STATUSES = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'resubmitted', label: 'Resubmitted' },
];

const SubmissionsFilterView = () => {
  const [, setStatus] = useQueryState<string>('status');

  return (
    <Filter.View>
      <Command>
        <Command.List className="p-1">
          {SUBMISSION_STATUSES.map((s) => (
            <Filter.CommandItem
              key={s.value}
              value={s.value}
              onSelect={() => setStatus(s.value)}
            >
              {s.label}
            </Filter.CommandItem>
          ))}
        </Command.List>
      </Command>
    </Filter.View>
  );
};

export const SubmissionsFilter = () => {
  const [status] = useQueryState<string>('status');

  const statusLabel = SUBMISSION_STATUSES.find(
    (s) => s.value === status,
  )?.label;

  return (
    <PageSubHeader>
      <Filter id="submissions-filter">
        <Filter.Bar>
          <Filter.BarItem queryKey="status">
            <Filter.BarName>Status</Filter.BarName>
            <Filter.BarButton>{statusLabel}</Filter.BarButton>
          </Filter.BarItem>

          <Filter.Popover scope="submissions-page">
            <Filter.Trigger isFiltered={Boolean(status)} />
            <Combobox.Content>
              <SubmissionsFilterView />
            </Combobox.Content>
          </Filter.Popover>
        </Filter.Bar>
      </Filter>
    </PageSubHeader>
  );
};
