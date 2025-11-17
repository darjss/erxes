import { BtkDeveloperInfo } from '@/btk/components/BtkDeveloperInfo';

export const DeveloperInfoPage = () => {
  return (
    <div className="flex flex-auto overflow-hidden">
      <div className="flex flex-col h-full overflow-auto flex-1">
        <BtkDeveloperInfo />
      </div>
    </div>
  );
};
