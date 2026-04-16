import { useMutation, useQuery } from '@apollo/client';
import { Button, Label, Select, Sheet, Spinner } from 'erxes-ui';
import { useEffect, useMemo, useState } from 'react';
import {
  MTO_REGISTRATION_APPLICATION,
  MTO_REGISTRATION_FORM_DEFINITION,
} from '@/registration/graphql/registrationQueries';
import { MTO_REGISTRATION_APPLICATION_UPDATE } from '@/registration/graphql/registrationMutations';
import { DynamicRegistrationForm } from '@/registration/components/DynamicRegistrationForm';
import { isFormDefinition } from '@/registration/utils/isFormDefinition';
import {
  ClientPortalUserSelect,
  IClientPortalUserRow,
} from '@/registration/components/ClientPortalUserSelect';
import { ClientPortalRemoteSelect } from '@/registration/components/ClientPortalRemoteSelect';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'draft' },
  { value: 'submitted', label: 'submitted' },
  { value: 'under_review', label: 'under_review' },
  { value: 'approved', label: 'approved' },
  { value: 'rejected', label: 'rejected' },
];

interface RegistrationDetailSheetProps {
  applicationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

export function RegistrationDetailSheet({
  applicationId,
  open,
  onOpenChange,
  onSaved,
}: RegistrationDetailSheetProps) {
  const { data, loading, error, refetch } = useQuery(
    MTO_REGISTRATION_APPLICATION,
    {
      variables: { _id: applicationId ?? '' },
      skip: !open || !applicationId,
    },
  );

  const [updateCpLink, { loading: cpLinkSaving }] = useMutation(
    MTO_REGISTRATION_APPLICATION_UPDATE,
  );

  const row = data?.mtoRegistrationApplication;

  const [status, setStatus] = useState<string>('submitted');
  const [portalRemoteId, setPortalRemoteId] = useState<string | undefined>();

  useEffect(() => {
    if (row?.status) {
      setStatus(row.status);
    }
  }, [row?.status, row?._id]);

  useEffect(() => {
    setPortalRemoteId(
      row?.clientPortalId ? String(row.clientPortalId) : undefined,
    );
  }, [row?._id, row?.clientPortalId]);

  const { data: defData, loading: defLoading } = useQuery(
    MTO_REGISTRATION_FORM_DEFINITION,
    {
      variables: {
        membershipTypeId: row?.membershipTypeId ?? '',
        version: row?.schemaVersion,
      },
      skip: !open || !row?.membershipTypeId,
    },
  );

  const definition = useMemo(() => {
    const raw = defData?.mtoRegistrationFormDefinition;
    return isFormDefinition(raw) ? raw : null;
  }, [defData?.mtoRegistrationFormDefinition]);

  const initialAnswers = useMemo(() => {
    const a = row?.answers;
    if (a && typeof a === 'object' && !Array.isArray(a)) {
      return a as Record<string, unknown>;
    }
    return {};
  }, [row?.answers, row?.modifiedAt]);

  async function handleCpUserChange(user: IClientPortalUserRow | null) {
    if (!applicationId) return;
    await updateCpLink({
      variables: {
        _id: applicationId,
        cpUserId: user?._id ?? null,
        clientPortalId: user?.clientPortalId ?? null,
        cpUserPhone: user?.phone ?? null,
      },
    });
    await refetch();
    onSaved?.();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <Sheet.View className="sm:max-w-2xl lg:max-w-4xl w-full md:w-[min(56rem,calc(100vw-1rem))]">
        <Sheet.Header className="shrink-0">
          <div className="flex flex-col items-start gap-1 min-w-0 flex-1 pr-2">
            <Sheet.Title className="truncate w-full">
              {row?.membershipTypeTitle ?? 'Бүртгэлийн дэлгэрэнгүй'}
            </Sheet.Title>
            {row?._id ? (
              <Sheet.Description className="font-mono text-xs break-all">
                {row._id}
              </Sheet.Description>
            ) : null}
          </div>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Content className="overflow-y-auto min-h-0 flex-1">
          <div className="p-5 pb-10 space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : error ? (
              <p className="text-destructive text-sm">{error.message}</p>
            ) : !row ? (
              <p className="text-muted-foreground text-sm">Олдсонгүй.</p>
            ) : defLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : !definition ? (
              <p className="text-muted-foreground text-sm">
                Маягтын тодорхойлолт олдсонгүй.
              </p>
            ) : (
              <>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Schema</dt>
                    <dd className="font-mono text-xs">{row.schemaVersion}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Subdomain</dt>
                    <dd className="font-mono text-xs">{row.subdomain}</dd>
                  </div>
                  {row.instanceId ? (
                    <div className="sm:col-span-2">
                      <dt className="text-muted-foreground">Instance</dt>
                      <dd className="font-mono text-xs break-all">
                        {row.instanceId}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label>Client portal</Label>
                    <ClientPortalRemoteSelect
                      value={portalRemoteId}
                      onValueChange={setPortalRemoteId}
                      placeholder="Портал сонгох"
                      disabled={cpLinkSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Client portal user</Label>
                    <ClientPortalUserSelect
                      clientPortalIdFilter={portalRemoteId}
                      value={row.cpUserId}
                      onValueChange={(user) => {
                        void handleCpUserChange(user);
                      }}
                      disabled={cpLinkSaving}
                      allowClear
                    />
                  </div>
                </div>

                <div className="space-y-2 max-w-xs">
                  <Label>Төлөв</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <Select.Trigger>
                      <Select.Value placeholder="Төлөв" />
                    </Select.Trigger>
                    <Select.Content>
                      {STATUS_OPTIONS.map((o) => (
                        <Select.Item key={o.value} value={o.value}>
                          {o.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </div>

                <DynamicRegistrationForm
                  definition={definition}
                  editApplicationId={applicationId!}
                  initialAnswers={initialAnswers}
                  registrationStatus={status}
                  formClassName="max-w-full"
                  hideDescription
                  onSubmitted={async () => {
                    await refetch();
                    onSaved?.();
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  Хаах
                </Button>
              </>
            )}
          </div>
        </Sheet.Content>
      </Sheet.View>
    </Sheet>
  );
}
