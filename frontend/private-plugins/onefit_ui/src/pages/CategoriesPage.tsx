import { useState } from 'react';
import { CategoriesList } from '~/modules/category/components/CategoriesList';
import { CreateCategoryDialog } from '~/modules/category/components/CreateCategoryDialog';
import { CategoryFiltersComponent } from '~/modules/category/components/CategoryFilters';
import { CategoryFilters } from '~/modules/category/types/category';
import { OneFitListPageLayout } from '~/components/OneFitListPageLayout';

export function CategoriesPage() {
  const [filters, setFilters] = useState<CategoryFilters>({});

  return (
    <OneFitListPageLayout
      pageName="Categories"
      filters={filters}
      onFiltersChange={setFilters}
      filtersComponent={CategoryFiltersComponent}
      createDialog={<CreateCategoryDialog />}
      listComponent={CategoriesList}
    />
  );
}
