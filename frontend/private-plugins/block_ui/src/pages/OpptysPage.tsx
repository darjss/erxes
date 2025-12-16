// import { ContractsBoard } from '@/contract/components/ContractsBoard';

import { OpptysLayout } from '@/oppty/components/OpptysLayout';
import { OpptysBoard } from '@/oppty/components/OpttysBoard';
import { useParams } from 'react-router-dom';

export const OpptysPage = () => {
  const { projectId } = useParams();

  if (!projectId) return null;

  return (
    <OpptysLayout>
      <OpptysBoard projectId={projectId} />
    </OpptysLayout>
  );
};
