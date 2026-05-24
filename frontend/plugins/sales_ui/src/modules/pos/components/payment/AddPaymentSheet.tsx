import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Button, Label, Input, Select, Sheet } from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import PaymentIcon from '@/pos/constants';
import { PaymentType } from '@/pos/types/types';
import { useTranslation } from 'react-i18next';

interface AddPaymentSheetProps {
  onPaymentAdded?: (payment: PaymentType) => void;
  onPaymentUpdated?: (payment: PaymentType) => void;
  editingPayment?: PaymentType | null;
  onEditComplete?: () => void;
}

const ICON_OPTIONS = [
  { value: 'credit-card', label: 'credit-card' },
  { value: 'cash', label: 'cash' },
  { value: 'bank', label: 'bank' },
  { value: 'mobile', label: 'mobile' },
  { value: 'visa', label: 'visa' },
  { value: 'mastercard', label: 'mastercard' },
  { value: 'sign-alt', label: 'sign-alt' },
];

export const AddPaymentSheet: React.FC<AddPaymentSheetProps> = ({
  onPaymentAdded,
  onPaymentUpdated,
  editingPayment,
  onEditComplete,
}) => {
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formIcon, setFormIcon] = useState('');
  const [formConfig, setFormConfig] = useState('');

  const generateId = () => nanoid();

  useEffect(() => {
    if (editingPayment) {
      setOpen(true);
      setFormType(editingPayment.type);
      setFormTitle(editingPayment.title);
      setFormIcon(editingPayment.icon);
      setFormConfig(editingPayment.config || '');
    }
  }, [editingPayment]);

  const resetForm = () => {
    setFormType('');
    setFormTitle('');
    setFormIcon('');
    setFormConfig('');
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
    onEditComplete?.();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      handleCancel();
    } else {
      setOpen(true);
    }
  };

  const handleSubmit = () => {
    const payment: PaymentType = {
      _id: editingPayment?._id || generateId(),
      type: formType,
      title: formTitle,
      icon: formIcon,
      config: formConfig,
    };

    if (editingPayment) {
      onPaymentUpdated?.(payment);
    } else {
      onPaymentAdded?.(payment);
    }

    setOpen(false);
    resetForm();
    onEditComplete?.();
  };

  const isEditing = !!editingPayment;

  const { t } = useTranslation('sales');

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {!isEditing && (
        <Sheet.Trigger asChild>
          <Button variant="outline">
            <IconPlus size={16} className="mr-2" />
            {t('add-payment')}
          </Button>
        </Sheet.Trigger>
      )}
      <Sheet.View className="p-0 sm:max-w-lg">
        <Sheet.Header>
          <Sheet.Title>
            {isEditing ? t('edit-payment') : t('add-payment')}
          </Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>

        <Sheet.Content className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>
              {t('TYPE')} <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              placeholder={t('payment-type-placeholder')}
            />
          </div>

          <div className="space-y-2">
            <Label>
              {t('TITLE')} <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder={t('payment-title')}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('ICON')}</Label>
            <Select value={formIcon} onValueChange={setFormIcon}>
              <Select.Trigger className="w-full">
                <Select.Value placeholder={t('select-icon')} />
              </Select.Trigger>
              <Select.Content>
                {ICON_OPTIONS.map((opt) => (
                  <Select.Item key={opt.value} value={opt.value}>
                    <div className="flex gap-2 items-center">
                      <PaymentIcon iconType={opt.value} size={16} />
                      {t(opt.label)}
                    </div>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('CONFIG')}</Label>
            <Input
              value={formConfig}
              onChange={(e) => setFormConfig(e.target.value)}
              placeholder={t('payment-config-placeholder')}
            />
          </div>
        </Sheet.Content>

        <Sheet.Footer className="bg-background">
          <Button variant="outline" onClick={handleCancel}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!formType || !formTitle}>
            {isEditing ? t('update') : t('add')}
          </Button>
        </Sheet.Footer>
      </Sheet.View>
    </Sheet>
  );
};
