import { InfoCard } from 'erxes-ui';

export const AgencyProfileVerificationWindow = () => {
  return (
    <InfoCard
      title="Verification status window"
      description="Verification status of the agency"
    >
      <InfoCard.Content>
        <div className="p-2">**Admin note**</div>
      </InfoCard.Content>
    </InfoCard>
  );
};
