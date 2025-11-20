import { InfoCard, InfoCardContent } from '@/btk/components/card';
import { Editor, Label } from 'erxes-ui';
import { useState } from 'react';

export const NewsDetailPolicies = () => {
  const [policies, setPolicies] = useState<string>('');
  return (
    <div className="p-8">
      <InfoCard title="Policies">
        <InfoCardContent>
          <div className="space-y-2">
            <Label>RESERVATION POLICY</Label>
            <Editor onChange={setPolicies} scope="news" />
          </div>
          <div className="space-y-2">
            <Label>LEASING POLICY</Label>
            <Editor onChange={setPolicies} scope="news" />
          </div>
        </InfoCardContent>
      </InfoCard>
    </div>
  );
};
