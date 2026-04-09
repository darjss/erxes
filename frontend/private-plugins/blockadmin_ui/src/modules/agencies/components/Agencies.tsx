import { Spinner } from 'erxes-ui';
import { useAgencies } from '../hooks/useAgencies';
import { AgencyCard } from './AgencyCard';
import { IAgency } from '../types';

export const Agencies = () => {
  const { agencies, loading } = useAgencies();

  if (loading) {
    return <Spinner containerClassName="ba:py-32" />;
  }

  return (
    <div className="grid grid-cols-1 ba:lg:grid-cols-2 ba:xl:grid-cols-3 gap-6 p-8">
      {agencies?.map((agency: IAgency) => (
        <AgencyCard key={agency._id} {...agency} />
      ))}
    </div>
  );
};
