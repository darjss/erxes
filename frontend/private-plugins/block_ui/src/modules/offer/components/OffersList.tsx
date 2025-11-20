import { useOffers } from '../hooks/useOffers';
import { IOffer } from '../types/offerTypes';
import { InfoCard, InfoCardContent } from '@/block/components/card';
import { OfferAddSheet } from '@/offer/components/OfferAdd';
import { IconDots, IconMail, IconPencil } from '@tabler/icons-react';
import { format } from 'date-fns';
import {
  Button,
  CurrencyDisplay,
  DropdownMenu,
  Empty,
  Label,
  Spinner,
  useQueryState,
} from 'erxes-ui';
import { CustomersInline, CompaniesInline, MembersInline } from 'ui-modules';

interface OffersListProps {
  unitId?: string;
  onSelectOffer?: (offer: IOffer) => void;
}

export function OffersList({ unitId, onSelectOffer }: OffersListProps) {
  const { offers, loading, error } = useOffers(unitId);

  if (loading) {
    return <Spinner containerClassName="blk:py-32" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-red-500">Error loading offers</div>
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <Empty>
        <Empty.Header>
          <Empty.Title>No offers found</Empty.Title>
          <Empty.Description>There seems to be no offers.</Empty.Description>
        </Empty.Header>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      {offers.map((offer) => (
        <OfferItem key={offer._id} {...offer} />
      ))}
    </div>
  );
}

export const OfferItem = ({
  number,
  party,
  amount,
  currency,
  user,
  endDate,
}: IOffer) => {
  return (
    <div className="flex gap-2">
      <div className="grid grid-cols-5 gap-2 items-center flex-auto">
        <div className="font-medium flex items-center gap-1 truncate">
          #{number}
        </div>
        <div className="truncate">{<DisplayParty party={party} />}</div>
        <div className="flex items-center truncate">
          <CurrencyDisplay variant="icon" code={currency} />
          {amount.toLocaleString()}
        </div>
        <div className="flex items-center gap-1 truncate">
          <MembersInline memberIds={user ? [user] : []} />
        </div>
        <div className="truncate">
          {format(new Date(Number(endDate)), 'MMM dd, yyyy')}
        </div>
      </div>
      <div className="w-10 text-right">
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="secondary" size="icon">
              <IconDots />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="blk:min-w-36" align="end">
            <DropdownMenu.Item className="cursor-pointer">
              <IconMail className="size-4" />
              <span>Send via Email</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="cursor-pointer">
              <IconPencil className="size-4" />
              <span>Edit</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const DisplayParty = ({ party }: { party: IOffer['party'] }) => {
  const PartyInline =
    party.type === 'customer' ? CustomersInline : CompaniesInline;
  return (
    <PartyInline
      {...(party.type === 'customer'
        ? { customerIds: [party.id] }
        : { companyIds: [party.id] })}
    />
  );
};

export const OffersListCard = () => {
  const [unitId] = useQueryState<string>('unitId');
  return (
    <InfoCard title="Offers">
      <InfoCardContent>
        <div className="flex gap-2 pr-12">
          <div className="grid grid-cols-5 gap-2 flex-auto">
            <Label asChild>
              <span>Number</span>
            </Label>
            <Label asChild>
              <span>Customer</span>
            </Label>
            <Label asChild>
              <span>Amount</span>
            </Label>
            <Label asChild>
              <span>Assigned To</span>
            </Label>
            <Label asChild>
              <span>Validity</span>
            </Label>
          </div>
        </div>
        <OffersList unitId={unitId || ''} />
        <OfferAddSheet />
      </InfoCardContent>
    </InfoCard>
  );
};

export const OfferSend = ({ offer }: { offer: IOffer }) => {
  return (
    <div className="flex items-center gap-1">
      <Button variant="secondary">View</Button>
    </div>
  );
};
