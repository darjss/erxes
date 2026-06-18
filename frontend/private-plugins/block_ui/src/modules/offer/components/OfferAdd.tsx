import {
  Button,
  Sheet,
  Spinner,
  Form,
  ScrollArea,
  Select,
  Label,
  Separator,
  useQueryState,
  CurrencyField,
  CurrencyCode,
  DatePicker,
  toast,
} from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useCreateOffer } from '@/offer/hooks/useManageOffer';
import { useForm, UseFormReturn } from 'react-hook-form';
import { OfferFormData, offerSchema } from '@/offer/constants/offerSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SelectCustomer,
  SelectCompany,
  SelectMember,
  currentUserState,
} from 'ui-modules';
import { useAtomValue } from 'jotai';
import { useUnit } from '@/unit/hooks/useUnit';
import { IUnit } from '@/unit/types/unitType';
import { addDays } from 'date-fns';
import { PaymentPlanForm } from '@/pricing/components/PaymentPlanForm';
import { InfoCard, InfoCardContent } from '@/block/components/card';
import { ContractUnit } from '@/contract/components/ContractUnit';

export const OfferAddSheet = () => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>
        <Button variant="secondary">
          <IconPlus />
          Add offer
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="blk:sm:max-w-5xl blk:md:w-[calc(100vw-(--spacing(4)))]">
        <Sheet.Header>
          <Sheet.Title>Add offer</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <OfferAddForm onClose={() => setOpen(false)} />
      </Sheet.View>
    </Sheet>
  );
};


export const OfferAddForm = ({ onClose }: { onClose: () => void }) => {
  const [unitId] = useQueryState<string>('unitId');
  const { unit } = useUnit(unitId);
  const currentUser = useAtomValue(currentUserState);
  const mainPrice = {
    _id: 'mainPrice',
    currency: CurrencyCode.MNT,
    price: unit?.unitType?.price,
    priceType: 'priceBySize' as const,
  };

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      paymentPlanId: '',
      endDate: addDays(new Date(), 7),
      partyType: 'customer',
      partyId: '',
      user: currentUser?._id,
      priceId: mainPrice._id,
      price: mainPrice,
    },
  });

  const { createOffer, loading } = useCreateOffer();

  const handleSubmit = (data: OfferFormData) => {
    const isPerSize = (data.price.priceType ?? 'priceBySize') === 'priceBySize';
    createOffer({
      variables: {
        input: {
          amount: data.price.price,
          amountType: isPerSize ? 'priceBySize' : 'priceByUnit',
          currency: data.price.currency,
          date: new Date(),
          endDate: data.endDate,
          party: {
            type: data.partyType,
            id: data.partyId,
          },
          paymentPlan: data.paymentPlan,
          user: data.user,
          unit: unitId,
        },
      },
      onCompleted: () => {
        toast({
          title: 'Offer created successfully',
          variant: 'default',
        });
        onClose();
        form.reset();
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
    <Form {...form}>
      <form
        className="flex-auto flex flex-col overflow-hidden"
        onSubmit={form.handleSubmit(handleSubmit)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT')
            e.preventDefault();
        }}
      >
        <Sheet.Content className="flex-auto overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-5">
              <ContractUnit />
            </div>
            <div className="grid grid-cols-4 gap-5 px-5 pb-5">
              <Form.Field
                name="user"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Assigned to</Form.Label>
                    <SelectMember.FormItem
                      value={field.value}
                      onValueChange={field.onChange}
                      mode="single"
                    />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="endDate"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Offer expires on</Form.Label>
                    <DatePicker
                      placeholder="end date"
                      value={field.value}
                      onChange={(date) => field.onChange(date as Date)}
                    />
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="partyType"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Lead Type</Form.Label>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.resetField('partyId');
                      }}
                      value={field.value}
                    >
                      <Form.Control>
                        <Select.Trigger className="h-8">
                          <Select.Value placeholder="Select party type" />
                        </Select.Trigger>
                      </Form.Control>
                      <Select.Content>
                        <Select.Item value="customer">Customer</Select.Item>
                        <Select.Item value="company">Company</Select.Item>
                      </Select.Content>
                    </Select>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <SelectLead form={form} />
              <Form.Field
                name="price.currency"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Currency</Form.Label>
                    <CurrencyField.SelectCurrency
                      value={field.value as CurrencyCode}
                      onChange={(value) =>
                        field.onChange(value as CurrencyCode)
                      }
                      display="code"
                    />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="price.price"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Price per m²</Form.Label>
                    <CurrencyField.ValueInput
                      value={field.value as number}
                      onChange={(value) => field.onChange(value as number)}
                    />
                  </Form.Item>
                )}
              />
              <Separator className="col-span-4" />
              <PaymentPlanForm form={form} />
            </div>
            <Separator className="mt-2" />
            <OfferSchedulePreview form={form} unit={unit} />
          </ScrollArea>
        </Sheet.Content>
        <Sheet.Footer className="flex-none">
          <OfferSummary form={form} unit={unit} />
          <Sheet.Close asChild>
            <Button variant="secondary" className="bg-border">
              Cancel
            </Button>
          </Sheet.Close>
          <Button type="submit" disabled={loading}>
            <Spinner show={loading} />
            Add offer
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};

const periodsPerYear = (frequency?: string): number => {
  switch (frequency) {
    case 'ONE_TIME_PER_MONTH': return 12;
    case 'TWO_TIME_PER_MONTH': return 24;
    case 'THREE_TIME_PER_MONTH': return 36;
    case 'QUARTERLY': return 4;
    case 'HALF_YEARLY': return 2;
    case 'YEARLY': return 1;
    default: return 12;
  }
};

const OfferSchedulePreview = ({
  form,
  unit,
}: {
  form: UseFormReturn<OfferFormData>;
  unit: IUnit;
}) => {
  const pricePerUnit = form.watch('price.price') || 0;
  const priceType = form.watch('price.priceType') ?? 'priceBySize';
  const currency = form.watch('price.currency') || 'MNT';
  const paymentPlan = form.watch('paymentPlan');

  if (!paymentPlan?.type) return null;

  const isPerSize = priceType === 'priceBySize';
  const unitSize = unit?.unitType?.size || 0;
  const totalAmount = isPerSize && unitSize > 0 ? pricePerUnit * unitSize : pricePerUnit;

  const discountPct = paymentPlan.discountPercentage || 0;
  const downPct = paymentPlan.downPaymentPercentage || 0;
  const completionPct = paymentPlan.completionPaymentPercentage || 0;
  const interestPct = paymentPlan.interestPercentage || 0;
  const interestType = paymentPlan.interestType || 'FLAT';
  const frequency = paymentPlan.frequency;
  const installmentCount = frequency === 'ONE_TIME' ? 0 : (paymentPlan.installment || 0);
  const ppy = periodsPerYear(frequency);

  const discountAmount = (totalAmount * discountPct) / 100;
  const priceAfterDiscount = totalAmount - discountAmount;

  const downAmount =
    (paymentPlan.downPaymentAmount || 0) > 0
      ? paymentPlan.downPaymentAmount!
      : (priceAfterDiscount * downPct) / 100;

  const completionAmount =
    (paymentPlan.completionPaymentAmount || 0) > 0
      ? paymentPlan.completionPaymentAmount!
      : (priceAfterDiscount * completionPct) / 100;

  const principal = priceAfterDiscount - downAmount - completionAmount;
  const roundedAmount = paymentPlan.roundedInstallmentAmount || 0;
  const baseInstallment =
    installmentCount > 0
      ? roundedAmount > 0
        ? roundedAmount
        : principal / installmentCount
      : 0;

  const hasInterest = interestPct > 0;
  const isOneTime = frequency === 'ONE_TIME';

  const fmt = (val: number) =>
    new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(val);

  const getInterest = (index: number) => {
    if (interestPct <= 0 || installmentCount <= 0) return 0;
    if (interestType === 'FLAT') {
      return (principal * interestPct) / 100 / installmentCount;
    }
    if (interestType === 'REDUCING') {
      const paidSoFar = baseInstallment * index;
      const remaining = principal - paidSoFar;
      return (remaining * interestPct) / 100 / ppy;
    }
    return ((principal * interestPct) / 100) * (installmentCount / ppy) / installmentCount;
  };

  const cols = hasInterest ? 'grid-cols-5' : 'grid-cols-4';

  const Header = ({ children }: { children: React.ReactNode }) => (
    <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
      {children}
    </div>
  );
  const Cell = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`px-3 py-2 border-t text-sm flex items-center ${className || ''}`}>
      {children}
    </div>
  );

  let grandTotal = 0;

  const sizeLabel = unitSize > 0 ? ` — ${unitSize} m² × ${pricePerUnit.toLocaleString()} = ${totalAmount.toLocaleString()} ${currency}` : '';

  return (
    <InfoCard title={`Payment schedule (preview)${sizeLabel}`}>
      <InfoCardContent className="shadow-none p-0 overflow-hidden">
        <div className={`grid ${cols} bg-muted/30`}>
          <Header>Payment</Header>
          <Header>Type</Header>
          <Header>Principal</Header>
          {hasInterest && <Header>Interest</Header>}
          <Header>Total</Header>
        </div>

        {downAmount > 0 && (() => {
          const row = downAmount;
          grandTotal += row;
          return (
            <div className={`grid ${cols}`}>
              <Cell>Down payment</Cell>
              <Cell>Down payment</Cell>
              <Cell>{fmt(downAmount)}</Cell>
              {hasInterest && <Cell>—</Cell>}
              <Cell>{fmt(row)}</Cell>
            </div>
          );
        })()}

        {isOneTime ? (() => {
          const interest = (priceAfterDiscount * interestPct) / 100;
          const row = priceAfterDiscount + interest;
          grandTotal += row;
          return (
            <div className={`grid ${cols}`}>
              <Cell>Full payment</Cell>
              <Cell>One-time</Cell>
              <Cell>{fmt(priceAfterDiscount)}</Cell>
              {hasInterest && <Cell>{fmt(interest)}</Cell>}
              <Cell>{fmt(row)}</Cell>
            </div>
          );
        })() : Array.from({ length: installmentCount }).map((_, i) => {
          const isLast = i === installmentCount - 1;
          const sumOthers = baseInstallment * (installmentCount - 1);
          const installPrincipal = isLast ? principal - sumOthers : baseInstallment;
          const interest = getInterest(i);
          const row = installPrincipal + interest;
          grandTotal += row;
          return (
            <div key={i} className={`grid ${cols}`}>
              <Cell>{i + 1}</Cell>
              <Cell>Progress payment</Cell>
              <Cell>{fmt(installPrincipal)}</Cell>
              {hasInterest && <Cell>{fmt(interest)}</Cell>}
              <Cell>{fmt(row)}</Cell>
            </div>
          );
        })}

        {completionAmount > 0 && (() => {
          grandTotal += completionAmount;
          return (
            <div className={`grid ${cols}`}>
              <Cell>Completion</Cell>
              <Cell>Completion payment</Cell>
              <Cell>{fmt(completionAmount)}</Cell>
              {hasInterest && <Cell>—</Cell>}
              <Cell>{fmt(completionAmount)}</Cell>
            </div>
          );
        })()}

        <div className={`grid ${cols} bg-muted/30 border-t font-medium`}>
          <Cell>Total</Cell>
          <Cell>{discountPct > 0 ? `Discount: ${fmt(discountAmount)}` : ' '}</Cell>
          <Cell>{fmt(priceAfterDiscount)}</Cell>
          {hasInterest && <Cell>{fmt(grandTotal - priceAfterDiscount)}</Cell>}
          <Cell>{fmt(grandTotal)}</Cell>
        </div>
      </InfoCardContent>
    </InfoCard>
  );
};

export const SelectLead = ({
  form,
}: {
  form: UseFormReturn<OfferFormData>;
}) => {
  const leadType = form.watch('partyType');
  const SelectLeadComponent =
    leadType === 'customer' ? SelectCustomer.FormItem : SelectCompany;
  return (
    <Form.Field
      control={form.control}
      name="partyId"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>Lead</Form.Label>
          <SelectLeadComponent
            value={field.value}
            onValueChange={field.onChange}
            mode="single"
          />
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};

export const OfferSummary = ({
  form,
  unit,
}: {
  form: UseFormReturn<OfferFormData>;
  unit: IUnit;
}) => {
  const price = form.watch('price.price') || 0;
  const currency = form.watch('price.currency');
  const priceType = form.watch('price.priceType') ?? 'priceBySize';
  const discountPct = form.watch('paymentPlan.discountPercentage') || 0;

  const totalAmount =
    priceType === 'priceBySize' && (unit?.unitType?.size || 0) > 0
      ? price * unit!.unitType!.size
      : price;
  const discountAmount = (totalAmount * discountPct) / 100;
  const offerPrice = totalAmount - discountAmount;

  return (
    <div className="flex-auto flex gap-4 items-center text-sm">
      <span className="text-muted-foreground flex items-center gap-1 font-medium">
        Total:
        <span className="text-primary font-bold">
          {totalAmount.toLocaleString()}
        </span>
        {currency}
      </span>
      {discountPct > 0 && (
        <span className="text-muted-foreground flex items-center gap-1 font-medium">
          Discount:
          <span className="text-destructive font-bold">
            -{discountAmount.toLocaleString()}
          </span>
          {currency}
        </span>
      )}
      {discountPct > 0 && (
        <span className="text-muted-foreground flex items-center gap-1 font-medium">
          Offer price:
          <span className="text-primary font-bold">
            {offerPrice.toLocaleString()}
          </span>
          {currency}
        </span>
      )}
    </div>
  );
};
