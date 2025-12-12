import { useState } from 'react';
import { CategoriesList } from '~/modules/category/components/CategoriesList';
import { CategoryDialog } from '~/modules/category/components/CategoryDialog';
import { IconPlus } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
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
      createDialog={
        <CategoryDialog
          trigger={
            <Button>
              <IconPlus />
              Create Category
            </Button>
          }
        />
      }
      listComponent={CategoriesList}
    />
  );
}
