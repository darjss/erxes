import { IconUser } from '@tabler/icons-react';
import { Combobox, Command, Filter, useMultiQueryState } from 'erxes-ui';
import { useTranslation } from 'react-i18next';
import { SpinHotKeyScope } from '../types/path/SpinHotKeyScope';
import { SpinTotalCount } from './SpinTotalCount';
import { useSpinLeadSessionKey } from '../hooks/useSpinLeadSessionKey';
import { SelectStatus } from './selects/SelectStatus';
import { SelectSpinCampaign } from './selects/SelectSpinCampaign';
import { SelectOwnerType } from './selects/SelectOwnerType';
import { SelectVoucherCampaign } from '../../vouchers/components/selects/SelectVoucherCampaign';
import { SelectCustomer, SelectMember } from 'ui-modules';

const SpinFilterPopover = () => {
  const { t } = useTranslation('loyalty');
  const [queries] = useMultiQueryState<{
    spinCampaign: string;
    ownerType: string;
    status: string;
    voucherCampaignId: string;
    ownerId: string;
    userId: string;
  }>([
    'spinCampaign',
    'ownerType',
    'status',
    'voucherCampaignId',
    'ownerId',
    'userId',
  ]);

  const hasFilters = Object.values(queries || {}).some(
    (value) => value !== null,
  );

  return (
    <>
      <Filter.Popover scope={SpinHotKeyScope.SpinPage}>
        <Filter.Trigger isFiltered={hasFilters} />
        <Combobox.Content>
          <Filter.View>
            <Command>
              <Filter.CommandInput
                placeholder={t('filter')}
                variant="secondary"
                className="bg-background"
              />
              <Command.List className="p-1">
                <SelectSpinCampaign.FilterItem />
                <SelectVoucherCampaign.FilterItem />
                <SelectOwnerType.FilterItem />
                <SelectCustomer.FilterItem value="ownerId" label={t('customer')} />
                <SelectMember.FilterItem value="userId" label={t('team-member')} />
                <SelectStatus.FilterItem />
              </Command.List>
            </Command>
          </Filter.View>
          <SelectSpinCampaign.FilterView />
          <SelectVoucherCampaign.FilterView />
          <SelectOwnerType.FilterView />
          <SelectCustomer.FilterView filterKey="ownerId" mode="single" />
          <SelectMember.FilterView queryKey="userId" mode="single" />
          <SelectStatus.FilterView />
        </Combobox.Content>
      </Filter.Popover>
      <Filter.Dialog>
        <Filter.View filterKey="spinCampaign" inDialog>
          <SelectSpinCampaign.FilterView queryKey="spinCampaign" />
        </Filter.View>
        <Filter.View filterKey="voucherCampaignId" inDialog>
          <SelectVoucherCampaign.FilterView />
        </Filter.View>
        <Filter.View filterKey="ownerType" inDialog>
          <SelectOwnerType.FilterView />
        </Filter.View>
        <Filter.View filterKey="ownerId" inDialog>
          <SelectCustomer.FilterView filterKey="ownerId" mode="single" />
        </Filter.View>
        <Filter.View filterKey="userId" inDialog>
          <SelectMember.FilterView queryKey="userId" mode="single" />
        </Filter.View>
        <Filter.View filterKey="status" inDialog>
          <SelectStatus.FilterView />
        </Filter.View>
      </Filter.Dialog>
    </>
  );
};

export const SpinFilter = () => {
  const { t } = useTranslation('loyalty');
  const { sessionKey } = useSpinLeadSessionKey();

  return (
    <Filter id="spin-filter" sessionKey={sessionKey}>
      <Filter.Bar>
        <SelectSpinCampaign.FilterBar />
        <SelectVoucherCampaign.FilterBar />
        <SelectOwnerType.FilterBar />
        <Filter.BarItem queryKey="ownerId">
          <Filter.BarName>
            <IconUser />
            {t('customer')}
          </Filter.BarName>
          <SelectCustomer.FilterBar
            filterKey="ownerId"
            label={t('customer')}
            mode="single"
          />
        </Filter.BarItem>
        <SelectMember.FilterBar
          queryKey="userId"
          label={t('team-member')}
          mode="single"
        />
        <SelectStatus.FilterBar />
        <SpinFilterPopover />
        <SpinTotalCount />
      </Filter.Bar>
    </Filter>
  );
};
