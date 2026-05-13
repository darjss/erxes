import { Button, Sheet, useQueryState, CurrencyCode, toast } from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useCreateContract } from '@/contract/hooks/useManageContract';
import { ContractFormData } from '@/contract/constants/contractSchema';
import { format } from 'date-fns';
import { ContractFormSheet } from './ContractFormSheet';

const STATUS_TYPE_TO_CONTRACT_STATUS: Record<string, string> = {
  reserved: 'reserved',
  draft: 'draft',
  signed: 'signed',
  cancelled: 'cancelled',
  lost: 'cancelled',
};

export const ContractAddSheet = () => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Add contract
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="p-0 sm:max-w-5xl">
        <Sheet.Header>
          <Sheet.Title>New contract</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <ContractAddForm onClose={() => setOpen(false)} />
      </Sheet.View>
    </Sheet>
  );
};

export const ContractAddForm = ({ onClose }: { onClose: () => void }) => {
  const [unitId] = useQueryState<string>('unitId');
  const { createContract, loading } = useCreateContract();

  const handleSubmit = (data: ContractFormData) => {
    const mappedStatus = data.status
      ? STATUS_TYPE_TO_CONTRACT_STATUS[data.status] || data.status
      : undefined;

    createContract({
      variables: {
        input: {
          unit: unitId || data.unit,
          number:
            data.number ||
            `${format(new Date(), 'yyMMddHHmmss').replace(/^0+/g, '')}`,
          currency: data.currency,
          date: data.date || new Date().toISOString(),
          amount: data.amount,
          amountType: data.amountType,
          status: mappedStatus,
          startDate: data.startDate,
          endDate: data.endDate,
          isLifeTime: data.isLifeTime,
          party: data.party
            ? { type: data.party.type, id: data.party.id }
            : undefined,
          paymentPlan: data.paymentPlan,
        },
      },
      refetchQueries: ['BlockGetContracts'],
      onCompleted: () => {
        toast({
          title: 'Contract created successfully',
          variant: 'success',
        });
        onClose();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <ContractFormSheet
      defaultValues={{
        unit: unitId || '',
        status: 'draft',
        party: { type: 'customer', id: '' },
        currency: CurrencyCode.MNT,
      }}
      onSubmit={handleSubmit}
      loading={loading}
      unitIdFromUrl={unitId}
    />
  );
};
