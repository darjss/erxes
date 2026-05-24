import { Form, Select } from 'erxes-ui';
import { useTranslation } from 'react-i18next';
import { useGetAnotherRulesOfProductsOnCityTax } from '../../hooks/useGetAnotherRulesOfProductsOnCityTax';
import { IAnotherRulesOfProductsOnCityTax } from '../../types/anotherRulesOfProductsOnCityTax';

export const SelectAnotherRulesOfProductsOnCityTax = ({
  value,
  onValueChange,
}: {
  value?: string;
  onValueChange: (value: string) => void;
}) => {
  const { t } = useTranslation('mongolian');
  const { anotherRulesOfProductsOnCityTax, loading } =
    useGetAnotherRulesOfProductsOnCityTax({
      skip: false,
      variables: {
        perPage: 20,
        page: 1,
      },
    });

  const selectedAnotherRulesOfProductsOnCityTax =
    anotherRulesOfProductsOnCityTax?.find(
      (category: IAnotherRulesOfProductsOnCityTax) => category._id === value,
    );

  return (
    <Select value={value || ''} onValueChange={onValueChange}>
      <Form.Control>
        <Select.Trigger>
          <span>
            {selectedAnotherRulesOfProductsOnCityTax?.title ||
              t('select-another-rules-of-products-on-city-tax')}
          </span>
        </Select.Trigger>
      </Form.Control>
      <Select.Content>
        {anotherRulesOfProductsOnCityTax?.map(
          (category: IAnotherRulesOfProductsOnCityTax) => (
            <Select.Item key={category._id} value={category._id}>
              {category.title}
            </Select.Item>
          ),
        )}

        {!loading && anotherRulesOfProductsOnCityTax?.length === 0 && (
          <Select.Item value="no-data">{t('no-categories-found')}</Select.Item>
        )}
      </Select.Content>
    </Select>
  );
};
