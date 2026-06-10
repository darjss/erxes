import {
  Button,
  Sheet,
  Spinner,
  Form,
  ScrollArea,
  Select,
  Input,
  CurrencyField,
  CurrencyCode,
  DatePicker,
  toast,
  Textarea,
  Sidebar,
} from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectCustomer, SelectCompany, SelectMember } from 'ui-modules';
import {
  ContractFormData,
  contractSchema,
} from '@/contract/constants/contractSchema';
import { CONTRACT_PARTY_TYPE_OPTIONS } from '@/contract/constants/contract';
import { PaymentPlanForm } from '@/pricing/components/PaymentPlanForm';
import { PaymentScheduleEditor } from './PaymentScheduleEditor';
import { ContractUnit } from './ContractUnit';
import { ContractUnitSelector } from './ContractUnitSelector';
import { useBlockContractStatusesByType } from '@/contract-status/hooks/useGetBlockContractStatuses';
import { IUnit } from '@/unit/types/unitType';
import { useState } from 'react';
import { useUnit } from '@/unit/hooks/useUnit';

const TYPE_ORDER = ['reserved', 'draft', 'signed', 'lost', 'cancelled'];

const FORM_TABS = {
  GENERAL: 'general',
  AMOUNT: 'amount',
  PAYMENT_PLAN: 'payment-plan',
} as const;
type FormTab = (typeof FORM_TABS)[keyof typeof FORM_TABS];

const FORM_TAB_LABELS: Record<FormTab, string> = {
  [FORM_TABS.GENERAL]: 'General',
  [FORM_TABS.AMOUNT]: 'Amount',
  [FORM_TABS.PAYMENT_PLAN]: 'Payment plan',
};

export const ContractFormSheet = ({
  defaultValues,
  onSubmit,
  loading,
  isEdit = false,
  unit,
  hideUnitSection = false,
  unitIdFromUrl,
  submitLabel,
}: {
  defaultValues?: Partial<ContractFormData>;
  onSubmit: (data: ContractFormData) => void;
  loading?: boolean;
  isEdit?: boolean;
  unit?: IUnit;
  hideUnitSection?: boolean;
  unitIdFromUrl?: string | null;
  submitLabel?: string;
}) => {
  const { projectId: projectIdParam, id: idParam } = useParams<{
    projectId?: string;
    id?: string;
  }>();
  const projectId = projectIdParam || idParam || '';
  const { statuses = [] } = useBlockContractStatusesByType({ projectId });
  const [activeTab, setActiveTab] = useState<FormTab>(FORM_TABS.GENERAL);

  const stages = [...statuses].sort((a, b) => {
    const ti = TYPE_ORDER.indexOf(a.type);
    const tj = TYPE_ORDER.indexOf(b.type);
    if (ti !== tj) return ti - tj;
    return (a.order || 0) - (b.order || 0);
  });

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      unit: unitIdFromUrl || '',
      status: '',
      party: { type: 'customer', id: '' },
      currency: CurrencyCode.MNT,
      ...defaultValues,
    },
  });

  const partyType = form.watch('party.type');
  const watchedUnitId = form.watch('unit');
  const { unit: fetchedUnit } = useUnit(!unit ? watchedUnitId : null);
  const activeUnit = unit || fetchedUnit;
  const unitSize = activeUnit?.unitType?.size || 0;

  const [useRateMode, setUseRateMode] = useState(false);
  const [ratePerSize, setRatePerSize] = useState<number>(0);

  const onValidationError = (errors: any) => {
    const messages: string[] = [];
    const collect = (obj: any, prefix = '') => {
      if (!obj || typeof obj !== 'object') return;
      for (const [key, val] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (val && typeof val === 'object' && 'message' in (val as any)) {
          messages.push(`${path}: ${(val as any).message}`);
        } else if (val && typeof val === 'object') {
          collect(val, path);
        }
      }
    };
    collect(errors);
    toast({
      title: 'Form invalid',
      description: messages.join('\n') || 'Please fix form errors',
      variant: 'destructive',
    });
  };

  const parseDateValue = (value: any) => {
    if (!value) return undefined;
    const num = Number(value);
    const d = new Date(isNaN(num) ? value : num);
    return isNaN(d.getTime()) ? undefined : d;
  };

  const handleDateChange = (
    onChange: (value: string | undefined) => void,
  ) => {
    return (date: Date | Date[] | undefined) => {
      const dateValue = Array.isArray(date) ? date[0] : date;
      onChange(dateValue ? dateValue.toISOString() : undefined);
    };
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onValidationError)}
        className="flex flex-col flex-auto overflow-hidden"
      >
        <Sheet.Content className="flex-auto overflow-hidden flex">
          <Sidebar collapsible="none" className="flex-none border-r w-52">
            <Sidebar.Group>
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  {Object.values(FORM_TABS).map((tab) => (
                    <Sidebar.MenuItem key={tab}>
                      <Sidebar.MenuButton
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        isActive={activeTab === tab}
                      >
                        {FORM_TAB_LABELS[tab]}
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                  ))}
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
          </Sidebar>

          <ScrollArea className="flex-auto h-full">
            <div className="flex flex-col gap-4 p-5">
              <div style={{ display: activeTab === FORM_TABS.GENERAL ? undefined : 'none' }} className="flex flex-col gap-4">
                  {!hideUnitSection &&
                    (unitIdFromUrl ? (
                      <ContractUnit />
                    ) : (
                      <ContractUnitSelector
                        control={form.control}
                        setValue={form.setValue}
                      />
                    ))}

                  {hideUnitSection && unit && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Number</div>
                        <div className="font-medium">{unit.number}</div>
                      </div>
                      {unit.unitType?.size != null && (
                        <div>
                          <div className="text-muted-foreground">Area</div>
                          <div className="font-medium">
                            {unit.unitType.size}m²
                          </div>
                        </div>
                      )}
                      {unit.unitType?.price != null && (
                        <div>
                          <div className="text-muted-foreground">Price</div>
                          <div className="font-medium">
                            {Number(unit.unitType.price).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="gap-4 grid grid-cols-3 items-end">
                    <Form.Field
                      name="date"
                      control={form.control}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Contract Date</Form.Label>
                          <DatePicker
                            placeholder="Select date"
                            value={parseDateValue(field.value)}
                            onChange={handleDateChange(field.onChange)}
                          />
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field
                      name="startDate"
                      control={form.control}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Start Date</Form.Label>
                          <DatePicker
                            placeholder="Select start date"
                            value={parseDateValue(field.value)}
                            onChange={handleDateChange(field.onChange)}
                          />
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field
                      name="endDate"
                      control={form.control}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>End Date</Form.Label>
                          <DatePicker
                            placeholder="Select end date"
                            value={parseDateValue(field.value)}
                            onChange={handleDateChange(field.onChange)}
                          />
                          <Form.Message />
                        </Form.Item>
                      )}
                    />
                  </div>

                  <div className="gap-4 grid grid-cols-2">
                    <Form.Field
                      name="number"
                      control={form.control}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Contract Number</Form.Label>
                          <Form.Control>
                            <Input
                              {...field}
                              value={field.value ?? ''}
                              placeholder="Auto-generated if empty"
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field
                      name="status"
                      control={form.control}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Status</Form.Label>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ''}
                          >
                            <Form.Control>
                              <Select.Trigger className="h-8">
                                <Select.Value placeholder="Select status" />
                              </Select.Trigger>
                            </Form.Control>
                            <Select.Content>
                              {stages.map((stage) => (
                                <Select.Item key={stage._id} value={stage._id}>
                                  <span className="flex items-center gap-2">
                                    {stage.color && (
                                      <span
                                        className="rounded-full size-2"
                                        style={{
                                          backgroundColor: stage.color,
                                        }}
                                      />
                                    )}
                                    {stage.name}
                                  </span>
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field
                      name="party.type"
                      control={form.control}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Party Type</Form.Label>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue('party.id', '');
                            }}
                            value={field.value}
                          >
                            <Form.Control>
                              <Select.Trigger className="h-8">
                                <Select.Value placeholder="Select party type" />
                              </Select.Trigger>
                            </Form.Control>
                            <Select.Content>
                              {CONTRACT_PARTY_TYPE_OPTIONS.map((option) => (
                                <Select.Item
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field
                      name="party.id"
                      control={form.control}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Party</Form.Label>
                          <Form.Control>
                            {partyType === 'customer' ? (
                              <SelectCustomer.FormItem
                                value={field.value}
                                onValueChange={field.onChange}
                                mode="single"
                              />
                            ) : (
                              <SelectCompany
                                value={field.value}
                                onValueChange={field.onChange}
                                mode="single"
                              />
                            )}
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field
                      name="user"
                      control={form.control}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Assigned to</Form.Label>
                          <SelectMember.FormItem
                            value={field.value || ''}
                            onValueChange={field.onChange}
                            mode="single"
                          />
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field
                      name="paymentPlan.description"
                      control={form.control}
                      render={({ field }) => (
                        <Form.Item className="col-span-2">
                          <Form.Label>Description</Form.Label>
                          <Form.Control>
                            <Textarea
                              {...field}
                              value={field.value ?? ''}
                              placeholder="Contract description"
                              className="min-h-20"
                              rows={5}
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />
                  </div>
              </div>

              <div style={{ display: activeTab === FORM_TABS.AMOUNT ? undefined : 'none' }}>
                <div className="gap-4 grid grid-cols-3">
                  <Form.Field
                    name="currency"
                    control={form.control}
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>Currency</Form.Label>
                        <CurrencyField.SelectCurrency
                          value={field.value as CurrencyCode}
                          onChange={(value) =>
                            field.onChange(value as CurrencyCode)
                          }
                        />
                        <Form.Message />
                      </Form.Item>
                    )}
                  />

                  <Form.Field
                    name="amount"
                    control={form.control}
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>
                          {useRateMode ? 'Rate per m²' : 'Total Amount'}
                        </Form.Label>
                        {useRateMode ? (
                          <CurrencyField.ValueInput
                            value={ratePerSize}
                            onChange={(v) => {
                              const rate = v || 0;
                              setRatePerSize(rate);
                              field.onChange(unitSize > 0 ? rate * unitSize : rate);
                            }}
                          />
                        ) : (
                          <CurrencyField.ValueInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                        {useRateMode && unitSize > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Total: {(ratePerSize * unitSize).toLocaleString()} ({unitSize} m²)
                          </p>
                        )}
                        {useRateMode && !unitSize && (
                          <p className="text-xs text-destructive">
                            Select a unit with a size first
                          </p>
                        )}
                        <Form.Message />
                      </Form.Item>
                    )}
                  />

                  <Form.Item>
                    <Form.Label>Entry Mode</Form.Label>
                    <div className="flex gap-1 h-8">
                      {[
                        { label: 'Total', value: false },
                        { label: 'Per m²', value: true },
                      ].map((opt) => (
                        <button
                          key={String(opt.value)}
                          type="button"
                          onClick={() => {
                            setUseRateMode(opt.value);
                            if (!opt.value) setRatePerSize(0);
                          }}
                          className={`flex-1 rounded-md text-xs font-medium border transition-colors ${
                            useRateMode === opt.value
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background text-muted-foreground border-input hover:border-ring hover:text-foreground'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </Form.Item>
                </div>
              </div>

              <div
                style={{
                  display:
                    activeTab === FORM_TABS.PAYMENT_PLAN ? undefined : 'none',
                }}
                className="flex flex-col gap-4"
              >
                <div className="gap-4 grid grid-cols-4">
                  <PaymentPlanForm form={form} />
                </div>
                <PaymentScheduleEditor form={form} />
              </div>
            </div>
          </ScrollArea>
        </Sheet.Content>
        <Sheet.Footer className="flex-none">
          <Button type="submit" disabled={loading}>
            {loading && <Spinner containerClassName="flex-none" />}
            {submitLabel || (isEdit ? 'Update' : 'Create')}
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};
