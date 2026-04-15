import {
  Badge,
  Button,
  FocusSheet,
  InfoCard,
  ScrollArea,
  Sheet,
  Spinner,
  Table,
  useQueryState,
} from 'erxes-ui';
import { useSupplierDetail } from '../hooks/useSupplierDetail';
import { useUpdateSupplierVerification } from '../hooks/useUpdateSupplierVerification';
import { ISupplier } from '../types';
import { SupplierVerificationAction } from './SupplierVerificationAction';

const verificationVariant = (status?: string) => {
  if (status === 'verified') return 'success' as const;
  if (status === 'unverified') return 'destructive' as const;
  return 'secondary' as const;
};

const Row = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | React.ReactNode;
}) => (
  <Table.Row>
    <Table.Cell className="bg-sidebar p-2 w-40 h-auto min-h-10 text-muted-foreground">
      {label}
    </Table.Cell>
    <Table.Cell className="p-2 h-auto min-h-10 whitespace-normal">
      {value ?? '-'}
    </Table.Cell>
  </Table.Row>
);

const SupplierInfo = ({ supplier }: { supplier: ISupplier }) => {
  const {
    _id,
    name,
    registrationNumber,
    dateFounded,
    website,
    primaryEmail,
    primaryPhone,
    verificationStatus,
    tierLevel,
    address,
    socialLinks = {},
  } = supplier || {};

  const { details = {} } = address || {};

  const { __typename, ...socialLinksWithoutTypename } = socialLinks || {};

  const cityDistrict = [details?.city, details?.city_district]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="flex flex-col gap-4">
      <InfoCard title="General">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              <Row label="Name" value={name} />
              <Row label="Registration #" value={registrationNumber} />
              <Row label="Founded" value={dateFounded} />
              <Row label="Website" value={website} />
              <Row label="Email" value={primaryEmail} />
              <Row label="Phone" value={primaryPhone} />
              <Row label="City" value={cityDistrict || details?.city} />
              <Row label="Address" value={address?.short} />
              <Table.Row>
                <Table.Cell className="bg-sidebar p-2 w-40 h-auto min-h-10 text-muted-foreground">
                  Verification
                </Table.Cell>
                <Table.Cell className="p-1 px-2 h-auto min-h-10 whitespace-normal">
                  <SupplierVerificationAction
                    supplierId={_id}
                    status={verificationStatus}
                  >
                    <Badge variant={verificationVariant(verificationStatus)}>
                      {verificationStatus || 'pending'}
                    </Badge>
                  </SupplierVerificationAction>
                </Table.Cell>
              </Table.Row>
              <Row label="Tier" value={tierLevel} />
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>

      {Object.values(socialLinksWithoutTypename)?.filter(Boolean)?.length
        ? Object.values(socialLinksWithoutTypename).some(Boolean) && (
            <InfoCard title="Social Links">
              <InfoCard.Content className="shadow-none p-0 overflow-hidden">
                <Table>
                  <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
                    {(
                      [
                        'facebook',
                        'instagram',
                        'twitter',
                        'linkedin',
                        'youtube',
                        'website',
                      ] as const
                    ).map((key) =>
                      socialLinksWithoutTypename[key] ? (
                        <Row
                          key={key}
                          label={key.charAt(0).toUpperCase() + key.slice(1)}
                          value={socialLinksWithoutTypename[key]}
                        />
                      ) : null,
                    )}
                  </Table.Body>
                </Table>
              </InfoCard.Content>
            </InfoCard>
          )
        : null}
    </div>
  );
};

export const SupplierDetailSheet = () => {
  const [activeSupplierId, setActiveSupplierId] =
    useQueryState<string>('activeSupplierId');
  const { supplier, loading } = useSupplierDetail(activeSupplierId);

  return (
    <FocusSheet
      open={!!activeSupplierId}
      onOpenChange={() => setActiveSupplierId(null)}
    >
      <FocusSheet.View className="sm:max-w-2xl">
        <FocusSheet.Header title={supplier?.name || 'Supplier Detail'} />
        <FocusSheet.Content className="flex flex-auto overflow-hidden">
          <ScrollArea className="flex-auto h-full">
            <div className="p-4">
              {loading && <Spinner />}
              {!loading && supplier && <SupplierInfo supplier={supplier} />}
              {!loading && !supplier && <div>Supplier not found</div>}
            </div>
          </ScrollArea>
        </FocusSheet.Content>
        <Sheet.Footer className="flex-none">
          <Sheet.Close asChild>
            <Button variant="secondary" className="bg-border">
              Close
            </Button>
          </Sheet.Close>
        </Sheet.Footer>
      </FocusSheet.View>
    </FocusSheet>
  );
};
