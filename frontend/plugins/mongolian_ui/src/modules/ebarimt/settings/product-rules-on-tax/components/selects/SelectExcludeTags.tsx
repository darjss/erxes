import { Form, Select } from 'erxes-ui';
import { useGetExcludeTags } from '@/ebarimt/settings/product-rules-on-tax/hooks/useExcludeTags';
import { IExcludeTag } from '@/ebarimt/settings/product-rules-on-tax/types/excludeTags';
import { useTranslation } from 'react-i18next';

export const SelectExcludeTags = ({
  value,
  onValueChange,
  disabled,
}: {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const { t } = useTranslation('mongolian');
  const { excludeTags, loading } = useGetExcludeTags({
    skip: false,
    variables: {
      perPage: 20,
      page: 1,
    },
  });

  const selectedExcludeTags = excludeTags?.find(
    (excludeTags: IExcludeTag) => excludeTags._id === value,
  );

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled || loading}
    >
      <Form.Control>
        <Select.Trigger>
          <span>{selectedExcludeTags?.name || t('select-tag')}</span>
        </Select.Trigger>
      </Form.Control>
      <Select.Content>
        {excludeTags?.map((excludeTags: IExcludeTag) => (
          <Select.Item key={excludeTags._id} value={excludeTags._id}>
            {excludeTags.name} {excludeTags.code ? `(${excludeTags.code})` : ''}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};
