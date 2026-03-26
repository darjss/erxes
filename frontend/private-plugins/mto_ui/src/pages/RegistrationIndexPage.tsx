import { useQuery } from '@apollo/client';
import { Button, Spinner } from 'erxes-ui';
import { useState } from 'react';
import { MtoPageLayout } from '~/components/MtoPageLayout';
import { MTO_REGISTRATION_MEMBERSHIP_SUMMARIES } from '@/registration/graphql/registrationQueries';
import { RegistrationFormSheet } from '@/registration/components/RegistrationFormSheet';

export function RegistrationIndexPage() {
  const { data, loading, error } = useQuery(MTO_REGISTRATION_MEMBERSHIP_SUMMARIES);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | undefined>();

  function openSheet(row: {
    membershipTypeId: string;
    title: string;
    schemaVersion: string;
  }) {
    setSelectedTypeId(row.membershipTypeId);
    setSelectedTitle(row.title);
    setSheetOpen(true);
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setSelectedTypeId(null);
      setSelectedTitle(undefined);
    }
  }

  if (loading) {
    return (
      <MtoPageLayout pageName="Гишүүнчлэлийн бүртгэл">
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      </MtoPageLayout>
    );
  }

  if (error) {
    return (
      <MtoPageLayout pageName="Гишүүнчлэлийн бүртгэл">
        <p className="text-destructive text-sm">{error.message}</p>
      </MtoPageLayout>
    );
  }

  const list = data?.mtoRegistrationMembershipSummaries ?? [];

  return (
    <MtoPageLayout pageName="Гишүүнчлэлийн бүртгэл">
      <p className="text-muted-foreground text-sm mb-6 max-w-2xl">
        Өөрийн үйл ажиллагааны төрлийг сонгон маягтыг бөглөнө үү. Маягт хажуугийн цонхонд нээгдэнэ.
      </p>
      <ul className="flex flex-col gap-3 max-w-xl">
        {list.map(
          (row: {
            membershipTypeId: string;
            title: string;
            schemaVersion: string;
          }) => (
            <li key={row.membershipTypeId}>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start h-auto py-3"
                onClick={() => openSheet(row)}
              >
                <span className="flex flex-col items-start gap-0.5">
                  <span className="font-medium">{row.title}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Хувилбар: {row.schemaVersion}
                  </span>
                </span>
              </Button>
            </li>
          ),
        )}
      </ul>

      <RegistrationFormSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        membershipTypeId={selectedTypeId}
        summaryTitle={selectedTitle}
      />
    </MtoPageLayout>
  );
}
