import {
  IconActivity,
  IconSettings,
  IconCaretDownFilled,
} from '@tabler/icons-react';
import {
  Breadcrumb,
  Button,
  PageContainer,
  PageSubHeader,
  Separator,
  ScrollArea,
} from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CategoriesList } from '~/modules/category/components/CategoriesList';
import { CreateCategoryDialog } from '~/modules/category/components/CreateCategoryDialog';
import { CategoryFiltersComponent } from '~/modules/category/components/CategoryFilters';
import { CategoryFilters } from '~/modules/category/types/category';

export const CategoriesPage = () => {
  const [filters, setFilters] = useState<CategoryFilters>({});

  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/settings/onefit">
                    <IconActivity />
                    OneFit
                  </Link>
                </Button>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Button variant="ghost" disabled>
                  Categories
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
        <PageHeader.End>
          <Button variant="outline" asChild>
            <Link to="/settings/onefit">
              <IconSettings />
              Go to settings
            </Link>
          </Button>
          <Button>
            More <IconCaretDownFilled />
          </Button>
        </PageHeader.End>
      </PageHeader>
      <div className="flex flex-auto overflow-hidden flex-col">
        <PageSubHeader>
          <div className="flex items-center gap-2">
            <CategoryFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
            />
            <CreateCategoryDialog />
          </div>
        </PageSubHeader>
        <ScrollArea className="flex-auto">
          <CategoriesList filters={filters} />
        </ScrollArea>
      </div>
    </PageContainer>
  );
};

