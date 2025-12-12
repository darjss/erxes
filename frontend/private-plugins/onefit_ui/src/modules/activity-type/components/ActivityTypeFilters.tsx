import { Input, Select } from 'erxes-ui';
import { useQuery } from '@apollo/client';
import { EnumCursorDirection, EnumCursorMode } from 'erxes-ui';
import { ActivityTypeFilters, GenderRestriction } from '../types/activityType';
import { ONE_FIT_PROVIDERS } from '~/modules/provider/graphql/providerQueries';
import { ONE_FIT_ACTIVITY_CATEGORIES } from '~/modules/category/graphql/categoryQueries';
import { getLocalizedString } from '../utils/localization';
import { getLocalizedString as getCategoryLocalizedString } from '~/modules/category/utils/localization';
import { OneFitFilterBase } from '~/components/OneFitFilterBase';
import { FilterField } from '~/components/shared/FilterField';

interface ActivityTypeFiltersProps {
  filters: ActivityTypeFilters;
  onFiltersChange: (filters: ActivityTypeFilters) => void;
}

export const ActivityTypeFiltersComponent = ({
  filters,
  onFiltersChange,
}: ActivityTypeFiltersProps) => {
  const { data: providersData, loading: providersLoading } = useQuery(
    ONE_FIT_PROVIDERS,
    {
      variables: {
        isActive: true,
        limit: 100,
        cursor: undefined,
        cursorMode: EnumCursorMode.INCLUSIVE,
        direction: EnumCursorDirection.FORWARD,
      },
    },
  );

  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    ONE_FIT_ACTIVITY_CATEGORIES,
    {
      variables: {
        limit: 100,
        cursor: undefined,
        cursorMode: EnumCursorMode.INCLUSIVE,
        direction: EnumCursorDirection.FORWARD,
      },
    },
  );

  const providers = providersData?.oneFitProviders?.list || [];
  const categories = categoriesData?.oneFitActivityCategories?.list || [];

  const handleFilterChange = (key: keyof ActivityTypeFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  return (
    <OneFitFilterBase filters={filters} onFiltersChange={onFiltersChange}>
      <FilterField label="Search">
        <Input
          value={filters.searchValue || ''}
          onChange={(e) => handleFilterChange('searchValue', e.target.value)}
          placeholder="Search by name or description"
        />
      </FilterField>
      <FilterField label="Provider">
        <Select
          value={filters.providerId || '__all__'}
          onValueChange={(value) =>
            handleFilterChange(
              'providerId',
              value === '__all__' ? undefined : value,
            )
          }
          disabled={providersLoading}
        >
          <Select.Trigger>
            <Select.Value placeholder="All providers" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="__all__">All providers</Select.Item>
            {providers.map(
              (provider: {
                _id: string;
                businessName: { en: string; mn: string };
              }) => (
                <Select.Item key={provider._id} value={provider._id}>
                  {getLocalizedString(provider.businessName, 'en')}
                </Select.Item>
              ),
            )}
          </Select.Content>
        </Select>
      </FilterField>
      <FilterField label="Category">
        <Select
          value={filters.categoryId || '__all__'}
          onValueChange={(value) =>
            handleFilterChange(
              'categoryId',
              value === '__all__' ? undefined : value,
            )
          }
          disabled={categoriesLoading}
        >
          <Select.Trigger>
            <Select.Value placeholder="All categories" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="__all__">All categories</Select.Item>
            {categories.map(
              (category: { _id: string; name: { en: string; mn: string } }) => (
                <Select.Item key={category._id} value={category._id}>
                  {getCategoryLocalizedString(category.name, 'en')}
                </Select.Item>
              ),
            )}
          </Select.Content>
        </Select>
      </FilterField>
      <FilterField label="Gender Restriction">
        <Select
          value={filters.genderRestriction || '__all__'}
          onValueChange={(value) =>
            handleFilterChange(
              'genderRestriction',
              value === '__all__' ? undefined : value,
            )
          }
        >
          <Select.Trigger>
            <Select.Value placeholder="All restrictions" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="__all__">All restrictions</Select.Item>
            <Select.Item value={GenderRestriction.MIXED}>Mixed</Select.Item>
            <Select.Item value={GenderRestriction.MALE}>Male</Select.Item>
            <Select.Item value={GenderRestriction.FEMALE}>Female</Select.Item>
          </Select.Content>
        </Select>
      </FilterField>
      <FilterField label="Status">
        <Select
          value={
            filters.isActive === undefined
              ? '__all__'
              : filters.isActive
              ? 'true'
              : 'false'
          }
          onValueChange={(value) =>
            handleFilterChange(
              'isActive',
              value === '__all__' ? undefined : value === 'true',
            )
          }
        >
          <Select.Trigger>
            <Select.Value placeholder="All statuses" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="__all__">All statuses</Select.Item>
            <Select.Item value="true">Active</Select.Item>
            <Select.Item value="false">Inactive</Select.Item>
          </Select.Content>
        </Select>
      </FilterField>
    </OneFitFilterBase>
  );
};
