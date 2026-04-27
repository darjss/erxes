import {
  Badge,
  Button,
  FocusSheet,
  InfoCard,
  ScrollArea,
  Sheet,
  Sidebar,
  Spinner,
  Table,
  Tabs,
  useQueryState,
} from 'erxes-ui';
import { ActivityLogs } from 'ui-modules';
import { useSupplierDetail } from '../hooks/useSupplierDetail';
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
    description,
    about,
    logo,
    coverImage,
    registrationNumber,
    dateFounded,
    website,
    primaryEmail,
    primaryPhone,
    emails = [],
    phones = [],
    verificationStatus,
    address,
    createdAt,
    updatedAt,
    socialLinks = {},
  } = supplier || {};

  const { details = {} } = address || {};
  const { __typename, ...socialLinksWithoutTypename } = socialLinks || {};

  const cityDistrict = [details?.city, details?.city_district]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="flex flex-col gap-4 p-4">
      {(logo || coverImage) && (
        <div className="relative">
          {coverImage && (
            <img src={coverImage} alt="Cover" className="rounded-lg w-full h-32 object-cover" />
          )}
          {logo && (
            <div className={coverImage ? 'absolute top-1/2 left-4 -translate-y-1/2' : ''}>
              <img src={logo} alt={name} className="border-2 border-background rounded-lg w-16 h-16 object-cover" />
            </div>
          )}
        </div>
      )}

      <InfoCard title="General">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              <Row label="Name" value={name} />
              <Row label="Registration #" value={registrationNumber} />
              <Row label="Founded" value={dateFounded} />
              <Row label="Website" value={website} />
              <Row label="Primary Email" value={primaryEmail} />
              <Row label="Primary Phone" value={primaryPhone} />
              {emails.length > 0 && <Row label="Emails" value={emails.join(', ')} />}
              {phones.length > 0 && <Row label="Phones" value={phones.join(', ')} />}
              <Row label="City" value={cityDistrict || details?.city} />
              <Row label="Address" value={address?.short} />
              <Table.Row>
                <Table.Cell className="bg-sidebar p-2 w-40 h-auto min-h-10 text-muted-foreground">
                  Verification
                </Table.Cell>
                <Table.Cell className="p-1 px-2 h-auto min-h-10 whitespace-normal">
                  <SupplierVerificationAction supplierId={_id} status={verificationStatus}>
                    <Badge variant={verificationVariant(verificationStatus)}>
                      {verificationStatus || 'unverified'}
                    </Badge>
                  </SupplierVerificationAction>
                </Table.Cell>
              </Table.Row>
              <Row label="Created" value={createdAt ? new Date(createdAt).toLocaleDateString() : undefined} />
              <Row label="Updated" value={updatedAt ? new Date(updatedAt).toLocaleDateString() : undefined} />
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>

      {(description || about) && (
        <InfoCard title="About">
          <InfoCard.Content className="shadow-none p-0 overflow-hidden">
            <Table>
              <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
                {description && <Row label="Description" value={<div dangerouslySetInnerHTML={{ __html: description }} />} />}
                {about && <Row label="About" value={<div dangerouslySetInnerHTML={{ __html: about }} />} />}
              </Table.Body>
            </Table>
          </InfoCard.Content>
        </InfoCard>
      )}

      {Object.values(socialLinksWithoutTypename).some(Boolean) && (
        <InfoCard title="Social Links">
          <InfoCard.Content className="shadow-none p-0 overflow-hidden">
            <Table>
              <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
                {(['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'website'] as const).map((key) =>
                  socialLinksWithoutTypename[key] ? (
                    <Row key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={socialLinksWithoutTypename[key]} />
                  ) : null,
                )}
              </Table.Body>
            </Table>
          </InfoCard.Content>
        </InfoCard>
      )}
    </div>
  );
};

const TABS = ['overview', 'activity'] as const;

export const SupplierDetailSheet = () => {
  const [activeSupplierId, setActiveSupplierId] = useQueryState<string>('activeSupplierId');
  const [tab, setTab] = useQueryState<string>('supplierTab');
  const { supplier, loading } = useSupplierDetail(activeSupplierId);

  const activeTab = tab ?? 'overview';

  return (
    <FocusSheet open={!!activeSupplierId} onOpenChange={() => setActiveSupplierId(null)}>
      <FocusSheet.View className="w-[50%] md:w-[50%]">
        <FocusSheet.Header title={supplier?.name || 'Supplier Detail'} />
        <FocusSheet.Content className="flex flex-auto overflow-hidden flex-row min-h-0">
          <FocusSheet.SideBar>
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupContent className="mt-2">
                  <Sidebar.Menu>
                    {TABS.map((t) => (
                      <Sidebar.MenuItem key={t}>
                        <Sidebar.MenuButton
                          isActive={activeTab === t}
                          onClick={() => setTab(t)}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Sidebar.MenuButton>
                      </Sidebar.MenuItem>
                    ))}
                  </Sidebar.Menu>
                </Sidebar.GroupContent>
              </Sidebar.Group>
            </Sidebar.Content>
          </FocusSheet.SideBar>

          <div className="flex flex-col flex-1 min-h-0 min-w-0">
            <Tabs value={activeTab} onValueChange={setTab} className="flex flex-col flex-1 min-h-0">
              <Tabs.Content value="overview" className="flex-1 min-h-0 data-[state=active]:flex flex-col">
                <ScrollArea className="flex-1 min-h-0">
                  {loading && <div className="p-4"><Spinner /></div>}
                  {!loading && supplier && <SupplierInfo supplier={supplier} />}
                  {!loading && !supplier && <div className="p-4">Supplier not found</div>}
                </ScrollArea>
              </Tabs.Content>

              <Tabs.Content value="activity" className="flex-1 min-h-0 data-[state=active]:flex flex-col">
                <ScrollArea className="flex-1 min-h-0">
                  <div className="flex flex-col mb-12">
                    {!!supplier?._id && (
                      <ActivityLogs
                        targetId={supplier._id}
                        showInternalNotes={false}
                      />
                    )}
                  </div>
                </ScrollArea>
              </Tabs.Content>
            </Tabs>

            <Sheet.Footer className="flex-none border-t">
              <Sheet.Close asChild>
                <Button variant="secondary" className="bg-border">
                  Close
                </Button>
              </Sheet.Close>
            </Sheet.Footer>
          </div>
        </FocusSheet.Content>
      </FocusSheet.View>
    </FocusSheet>
  );
};
