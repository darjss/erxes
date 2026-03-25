import { useAgencyProfileForm } from '~/modules/blockagent/components/agency/hooks/useAgencyProfileForm';
import { ProfileMutateLayout } from './ProfileMutateLayout';
import { AgencyForm } from './AgencyForm';
import { useAgencyInfo } from '../hooks/useAgencyInfo';
import { useEffect } from 'react';

export const AgencyProfileInfo = () => {
  const { form, onSubmit, loading } = useAgencyProfileForm();
  const { agencyInfo, loading: isLoading } = useAgencyInfo();

  useEffect(() => {
    if (!agencyInfo) return;
    form.reset(agencyInfo);
  }, [agencyInfo]);

  return (
    <ProfileMutateLayout
      title="Agency Profile"
      form={form}
      onSubmit={onSubmit}
      isLoading={loading}
      verificationStatus={agencyInfo?.verificationStatus}
    >
      <AgencyForm
        form={form}
        _id={agencyInfo?._id}
        isPending={agencyInfo?.verificationStatus === 'pending' || false}
      />
    </ProfileMutateLayout>
  );
};
