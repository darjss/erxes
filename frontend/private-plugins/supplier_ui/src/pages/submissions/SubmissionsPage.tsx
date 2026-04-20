import { SubmissionsHeader } from '@/submissions/components/SubmissionsHeader';
import { SubmissionsFilter } from '@/submissions/components/SubmissionsFilter';
import { SubmissionsTable } from '@/submissions/components/SubmissionsTable';

export const SubmissionsPage = () => {
  return (
    <div className="flex flex-col">
      <SubmissionsHeader />
      <SubmissionsFilter />
      <div className="flex-1 overflow-auto">
        <SubmissionsTable />
      </div>
    </div>
  );
};

export default SubmissionsPage;
