import { InfoCard, InfoCardContent } from '@/btk/components/card';
import { BANKS } from '~/modules/news/constants/banks';
import { useNewsDetail } from '~/modules/news/hooks/useNewsDetail';
import { useUpdateNewsGeneralInfo } from '~/modules/news/hooks/useUpdateNews';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { Button, Select } from 'erxes-ui';
import { useEffect, useState } from 'react';

export const NewsBankPartners = () => {
  const { news } = useNewsDetail();
  const [bankPartners, setBankPartners] = useState(news?.bankPartners);
  const { updateNewsGeneralInfo } = useUpdateNewsGeneralInfo();

  useEffect(() => {
    if (news?.bankPartners) {
      setBankPartners(news?.bankPartners);
    }
  }, [news?.bankPartners]);

  const handleUpdateBankPartners = (bankPartners: string[]) => {
    setBankPartners(bankPartners);
    updateNewsGeneralInfo(news?._id || '', { bankPartners });
  };

  return (
    <InfoCard title="BANK PARTNERS" description="Bank partners">
      <InfoCardContent>
        {bankPartners?.map((bankPartner, index) => (
          <div className="flex gap-2" key={bankPartner || index}>
            <Select
              value={bankPartner}
              onValueChange={(value) =>
                handleUpdateBankPartners(
                  bankPartners.map((bank, i) => (i === index ? value : bank)),
                )
              }
            >
              <Select.Trigger className="h-8">
                <Select.Value placeholder="Select bank partners" />
              </Select.Trigger>
              <Select.Content>
                {BANKS.filter(
                  (bank) =>
                    !bankPartners.includes(bank.short) ||
                    bankPartner === bank.short,
                ).map((bank) => (
                  <Select.Item value={bank.short}>{bank.name}</Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Button
              variant="secondary"
              size="icon"
              className="flex-none size-8 text-destructive bg-destructive/10 hover:bg-destructive/20"
              onClick={() =>
                setBankPartners(bankPartners.filter((_, i) => i !== index))
              }
            >
              <IconTrash />
            </Button>
          </div>
        ))}
        <Button
          variant="secondary"
          onClick={() => setBankPartners([...(bankPartners || []), ''])}
        >
          <IconPlus />
          Add bank
        </Button>
      </InfoCardContent>
    </InfoCard>
  );
};
