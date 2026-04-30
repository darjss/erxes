import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Breadcrumb,
  Button,
  Combobox,
  Empty,
  InfoCard,
  PageContainer,
  PageSubHeader,
  Spinner,
  Tabs,
  useConfirm,
} from 'erxes-ui';
import {
  IconCalendar,
  IconCarSuv,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import {
  ActivityLogs,
  AddInternalNote,
  TagsSelect,
  useRelations,
} from 'ui-modules';
import { PageHeader } from 'ui-modules';
import { useTranslation } from 'react-i18next';

import { CarFormSheet } from '~/components/cars/CarFormSheet';
import { CarPropertiesInDetail } from '~/components/properties/CarPropertiesInDetail';
import { useCarCustomFieldEdit } from '~/hooks/useCarCustomFieldEdit';
import {
  useCarCategories,
  useCarDetail,
  useDealsByIds,
} from '~/hooks/useCarsData';
import { useCarMutations } from '~/hooks/useCarMutations';
import {
  formatDateTime,
  getCarOptionLabel,
  getCarDisplayName,
  getCompanyDisplayName,
  getCustomerDisplayName,
} from '~/lib/car';
import { customFieldsDataToPropertiesData } from '~/lib/customFields';
import {
  CAR_BODY_TYPE_OPTIONS,
  CAR_FUEL_TYPE_OPTIONS,
  CAR_GEARBOX_OPTIONS,
  ROOT_CAR_CONTENT_TYPE,
} from '~/lib/constants';
import { isEnabled } from 'erxes-ui';

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 border-b border-border/60 py-3 last:border-none">
      <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="min-w-0 text-sm">{value}</div>
    </div>
  );
};

export const CarDetailPage = () => {
  const { t } = useTranslation('car');
  const { carId } = useParams();
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const { car, loading } = useCarDetail(carId);
  const { carCategories } = useCarCategories();
  const { carsRemove } = useCarMutations();
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const salesEnabled = isEnabled('sales');

  const { ownEntities: relatedDealEntities } = useRelations({
    variables: {
      contentId: carId || '',
      contentType: ROOT_CAR_CONTENT_TYPE,
      relatedContentType: 'sales:deal',
    },
    skip: !salesEnabled || !carId,
  });

  const relatedDealIds = useMemo(
    () =>
      Array.from(
        new Set(
          relatedDealEntities.map((entity) => entity.contentId).filter(Boolean),
        ),
      ),
    [relatedDealEntities],
  );

  const { deals } = useDealsByIds(salesEnabled ? relatedDealIds : []);

  const bodyTypeLabel = getCarOptionLabel(
    CAR_BODY_TYPE_OPTIONS,
    car?.bodyType,
    t,
  );
  const fuelTypeLabel = getCarOptionLabel(
    CAR_FUEL_TYPE_OPTIONS,
    car?.fuelType,
    t,
  );
  const gearBoxLabel = getCarOptionLabel(CAR_GEARBOX_OPTIONS, car?.gearBox, t);
  const quickFacts = [
    car?.category?.name,
    car?.bodyType ? bodyTypeLabel : null,
    car?.fuelType ? fuelTypeLabel : null,
    car?.gearBox ? gearBoxLabel : null,
  ].filter(Boolean);

  const handleDelete = async () => {
    if (!car?._id) {
      return;
    }

    await confirm({
      message: t('Delete {{name}}?', {
        name: getCarDisplayName(car, t),
        defaultValue: 'Delete {{name}}?',
      }),
      options: {
        variant: 'destructive',
        okLabel: t('Delete', { defaultValue: 'Delete' }),
        description: t('This permanently removes the car record.', {
          defaultValue: 'This permanently removes the car record.',
        }),
      },
    });

    await carsRemove({
      variables: {
        carIds: [car._id],
      },
    });

    navigate('/car');
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      </PageContainer>
    );
  }

  if (!car) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeader.Start>
            <Breadcrumb>
              <Breadcrumb.List className="gap-1">
                <Breadcrumb.Item>
                  <Button variant="ghost" asChild>
                    <Link to="/car">
                      <IconCarSuv />
                      {t('Cars', { defaultValue: 'Cars' })}
                    </Link>
                  </Button>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb>
          </PageHeader.Start>
        </PageHeader>
        <div className="flex flex-1 items-center justify-center p-6">
          <Empty>
            <Empty.Header>
              <Empty.Media variant="icon">
                <IconCarSuv />
              </Empty.Media>
              <Empty.Title>
                {t('Car not found', { defaultValue: 'Car not found' })}
              </Empty.Title>
              <Empty.Description>
                {t('The requested car record could not be loaded.', {
                  defaultValue: 'The requested car record could not be loaded.',
                })}
              </Empty.Description>
            </Empty.Header>
          </Empty>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/car">
                    <IconCarSuv />
                    {t('Cars', { defaultValue: 'Cars' })}
                  </Link>
                </Button>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Page>
                <Button variant="ghost" asChild>
                  <Link to={`/car/${car._id}`}>
                    {getCarDisplayName(car, t)}
                  </Link>
                </Button>
              </Breadcrumb.Page>
            </Breadcrumb.List>
          </Breadcrumb>
        </PageHeader.Start>
        <PageHeader.End>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <IconEdit className="size-4" />
            {t('Edit', { defaultValue: 'Edit' })}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <IconTrash className="size-4" />
            {t('Delete', { defaultValue: 'Delete' })}
          </Button>
        </PageHeader.End>
      </PageHeader>

      <PageSubHeader className="flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{getCarDisplayName(car, t)}</Badge>
          {quickFacts.map((fact) => (
            <Badge key={fact} variant="outline">
              {fact}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <IconCalendar className="size-4" />
          {t('Updated {{date}}', {
            date: formatDateTime(car.modifiedAt || car.createdAt),
            defaultValue: 'Updated {{date}}',
          })}
        </div>
      </PageSubHeader>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div className="px-4 pt-4">
          <Tabs.List>
            <Tabs.Trigger value="overview">
              {t('Overview', { defaultValue: 'Overview' })}
            </Tabs.Trigger>
            <Tabs.Trigger value="properties">
              {t('Properties', { defaultValue: 'Properties' })}
            </Tabs.Trigger>
            <Tabs.Trigger value="activity">
              {t('Activity', { defaultValue: 'Activity' })}
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content
          value="overview"
          className="flex-1 overflow-auto px-4 pb-4 pt-4"
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,0.95fr)]">
            <InfoCard title={t('Car Profile', { defaultValue: 'Car Profile' })}>
              <InfoCard.Content>
                <DetailRow
                  label={t('Plate number', { defaultValue: 'Plate number' })}
                  value={car.plateNumber || '—'}
                />
                <DetailRow
                  label={t('VIN', { defaultValue: 'VIN' })}
                  value={car.vinNumber || '—'}
                />
                <DetailRow
                  label={t('Category', { defaultValue: 'Category' })}
                  value={car.category?.name || '—'}
                />
                <DetailRow
                  label={t('Owner', { defaultValue: 'Owner' })}
                  value={
                    car.owner?.details?.fullName || car.owner?.email || '—'
                  }
                />
                <DetailRow
                  label={t('Body type', { defaultValue: 'Body type' })}
                  value={bodyTypeLabel}
                />
                <DetailRow
                  label={t('Fuel type', { defaultValue: 'Fuel type' })}
                  value={fuelTypeLabel}
                />
                <DetailRow
                  label={t('Gearbox', { defaultValue: 'Gearbox' })}
                  value={gearBoxLabel}
                />
                <DetailRow
                  label={t('Vintage year', { defaultValue: 'Vintage year' })}
                  value={car.vintageYear || '—'}
                />
                <DetailRow
                  label={t('Import year', { defaultValue: 'Import year' })}
                  value={car.importYear || '—'}
                />
                <DetailRow
                  label={t('Color', { defaultValue: 'Color' })}
                  value={
                    car.colorCode ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="size-4 rounded-full border"
                          style={{ backgroundColor: car.colorCode }}
                        />
                        <span>{car.colorCode}</span>
                      </div>
                    ) : (
                      '—'
                    )
                  }
                />
                <DetailRow
                  label={t('Description', { defaultValue: 'Description' })}
                  value={
                    car.description ? (
                      <p className="whitespace-pre-wrap text-sm">
                        {car.description}
                      </p>
                    ) : (
                      '—'
                    )
                  }
                />
              </InfoCard.Content>
            </InfoCard>

            <div className="space-y-4">
              <InfoCard title={t('Relations', { defaultValue: 'Relations' })}>
                <InfoCard.Content className="gap-4">
                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                      {t('Customers', { defaultValue: 'Customers' })}
                    </div>
                    {car.customers?.length ? (
                      car.customers.map((customer) => (
                        <div
                          key={customer._id}
                          className="rounded-lg border bg-sidebar/30 px-3 py-2 text-sm"
                        >
                          <div className="font-medium">
                            {getCustomerDisplayName(customer)}
                          </div>
                          <div className="text-muted-foreground">
                            {customer.primaryEmail ||
                              customer.primaryPhone ||
                              customer._id}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {t('No customers linked.', {
                          defaultValue: 'No customers linked.',
                        })}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                      {t('Companies', { defaultValue: 'Companies' })}
                    </div>
                    {car.companies?.length ? (
                      car.companies.map((company) => (
                        <div
                          key={company._id}
                          className="rounded-lg border bg-sidebar/30 px-3 py-2 text-sm"
                        >
                          <div className="font-medium">
                            {getCompanyDisplayName(company)}
                          </div>
                          <div className="text-muted-foreground">
                            {company.website || company._id}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {t('No companies linked.', {
                          defaultValue: 'No companies linked.',
                        })}
                      </div>
                    )}
                  </div>

                  {salesEnabled ? (
                    <div className="space-y-2">
                      <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                        {t('Deals', { defaultValue: 'Deals' })}
                      </div>
                      {deals.length ? (
                        deals.map((deal) => (
                          <div
                            key={deal._id}
                            className="rounded-lg border bg-sidebar/30 px-3 py-2 text-sm"
                          >
                            <div className="font-medium">
                              {deal.name || deal._id}
                            </div>
                            <div className="text-muted-foreground">
                              {deal.stage?.name || deal.status || '—'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {t('No deals linked.', {
                            defaultValue: 'No deals linked.',
                          })}
                        </div>
                      )}
                    </div>
                  ) : null}
                </InfoCard.Content>
              </InfoCard>
            </div>

            <div className="space-y-4">
              <InfoCard title={t('Metadata', { defaultValue: 'Metadata' })}>
                <InfoCard.Content>
                  <DetailRow
                    label={t('Created', { defaultValue: 'Created' })}
                    value={formatDateTime(car.createdAt)}
                  />
                  <DetailRow
                    label={t('Modified', { defaultValue: 'Modified' })}
                    value={formatDateTime(car.modifiedAt)}
                  />
                  <DetailRow
                    label={t('Merged IDs', { defaultValue: 'Merged IDs' })}
                    value={
                      car.mergedIds?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {car.mergedIds.map((mergedId) => (
                            <Badge key={mergedId} variant="outline">
                              {mergedId}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        '—'
                      )
                    }
                  />
                  <DetailRow
                    label={t('Tags', { defaultValue: 'Tags' })}
                    value={
                      <TagsSelect.Provider
                        mode="multiple"
                        type={ROOT_CAR_CONTENT_TYPE}
                        targetIds={[car._id]}
                        value={car.tagIds || []}
                        options={() => ({
                          refetchQueries: 'active',
                        })}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          {car.getTags?.length ? (
                            car.getTags.map((tag) => (
                              <Badge key={tag._id} variant="secondary">
                                {tag.name || tag._id}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">
                              {t('No tags', { defaultValue: 'No tags' })}
                            </span>
                          )}
                          <TagsSelect.Trigger
                            variant="secondary"
                            size="sm"
                            placeholder={t('Edit tags', {
                              defaultValue: 'Edit tags',
                            })}
                          />
                        </div>
                        <Combobox.Content className="w-80">
                          <TagsSelect.Content />
                        </Combobox.Content>
                      </TagsSelect.Provider>
                    }
                  />
                </InfoCard.Content>
              </InfoCard>

              {car.attachment?.url ? (
                <InfoCard
                  title={t('Featured Image', {
                    defaultValue: 'Featured Image',
                  })}
                >
                  <InfoCard.Content>
                    <img
                      src={car.attachment.url}
                      alt={getCarDisplayName(car, t)}
                      className="aspect-[4/3] w-full rounded-lg object-cover"
                    />
                  </InfoCard.Content>
                </InfoCard>
              ) : null}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content
          value="properties"
          className="flex-1 overflow-auto px-4 pb-4 pt-4"
        >
          <CarPropertiesInDetail
            title={t('Car Properties', { defaultValue: 'Car Properties' })}
            fieldContentType={ROOT_CAR_CONTENT_TYPE}
            propertiesData={customFieldsDataToPropertiesData(
              car.customFieldsData,
            )}
            mutateHook={useCarCustomFieldEdit}
            id={car._id}
          />
        </Tabs.Content>

        <Tabs.Content
          value="activity"
          className="flex-1 overflow-auto px-4 pb-4 pt-4"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4">
            <AddInternalNote
              contentType={ROOT_CAR_CONTENT_TYPE}
              contentTypeId={car._id}
            />
            <ActivityLogs
              targetId={car._id}
              emptyMessage={t(
                'No activity has been recorded for this car yet.',
                {
                  defaultValue:
                    'No activity has been recorded for this car yet.',
                },
              )}
            />
          </div>
        </Tabs.Content>
      </Tabs>

      <CarFormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        car={car}
        categories={carCategories}
      />
    </PageContainer>
  );
};
