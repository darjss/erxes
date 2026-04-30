import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Link } from 'react-router-dom';
import {
  IconCarSuv,
  IconFolder,
  IconPlus,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import {
  Badge,
  Breadcrumb,
  Button,
  Input,
  PageContainer,
  PageSubHeader,
  useConfirm,
} from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { useTranslation } from 'react-i18next';

import { CarFormSheet } from '~/components/cars/CarFormSheet';
import { CarsRecordTable } from '~/components/cars/CarsRecordTable';
import { MergeCarsDialog } from '~/components/cars/MergeCarsDialog';
import { CategoriesSidebar } from '~/components/categories/CategoriesSidebar';
import { CategoryFormDialog } from '~/components/categories/CategoryFormDialog';
import { SegmentFilter } from '~/components/filter/SegmentFilter';
import { TagFilter } from '~/components/filter/TagFilter';
import { PaginationBar } from '~/components/shared/PaginationBar';
import { useCarCategories, useCarsMain } from '~/hooks/useCarsData';
import { useCarMutations } from '~/hooks/useCarMutations';
import { useCarsQueryState } from '~/hooks/useCarsQueryState';
import { ICar, ICarCategory } from '~/types/car';

export const CarsIndexPage = () => {
  const { t } = useTranslation('car');
  const {
    filters,
    clearFilters,
    setCategoryId,
    setPage,
    setPerPage,
    setSearchValue,
    setSegment,
    setSort,
    setTag,
  } = useCarsQueryState();
  const { confirm } = useConfirm();
  const { carCategories, loading: categoriesLoading } = useCarCategories();
  const { carCategoriesRemove } = useCarMutations();

  const variables = useMemo(
    () => ({
      page: filters.page,
      perPage: filters.perPage,
      categoryId: filters.categoryId || undefined,
      tag: filters.tag || undefined,
      segment: filters.segment || undefined,
      segmentData: filters.segmentData || undefined,
      searchValue: filters.searchValue || undefined,
      sortField: filters.sortField || undefined,
      sortDirection: filters.sortDirection || undefined,
      ids: filters.ids || undefined,
    }),
    [filters],
  );

  const { cars, totalCount, loading, error } = useCarsMain(variables);

  const [searchInput, setSearchInput] = useState(filters.searchValue || '');
  const [debouncedSearch] = useDebounce(searchInput, 350);
  const [carFormOpen, setCarFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<ICar | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICarCategory | null>(
    null,
  );
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [mergeCars, setMergeCars] = useState<ICar[]>([]);

  useEffect(() => {
    setSearchInput(filters.searchValue || '');
  }, [filters.searchValue]);

  useEffect(() => {
    const normalizedSearch = debouncedSearch.trim();
    const normalizedInput = searchInput.trim();
    const currentSearch = filters.searchValue || '';

    if (normalizedSearch !== normalizedInput) {
      return;
    }

    if (normalizedSearch !== currentSearch) {
      setSearchValue(normalizedSearch || null);
    }
  }, [debouncedSearch, filters.searchValue, searchInput, setSearchValue]);

  const selectedCategory = useMemo(
    () =>
      carCategories.find((category) => category._id === filters.categoryId) ||
      null,
    [carCategories, filters.categoryId],
  );

  const handleOpenCreateCar = () => {
    setEditingCar(null);
    setCarFormOpen(true);
  };

  const handleOpenCategoryCreate = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    clearFilters();
  };

  const handleDeleteCategory = async (category: ICarCategory) => {
    await confirm({
      message: t('Delete {{name}}?', {
        name: category.name || category.code,
        defaultValue: 'Delete {{name}}?',
      }),
      options: {
        variant: 'destructive',
        okLabel: t('Delete', { defaultValue: 'Delete' }),
        description: t(
          'This category can only be deleted when it has no child categories or cars.',
          {
            defaultValue:
              'This category can only be deleted when it has no child categories or cars.',
          },
        ),
      },
    });

    await carCategoriesRemove({
      variables: {
        _id: category._id,
      },
    });
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Page>
                <Button variant="ghost" asChild>
                  <Link to="/car">
                    <IconCarSuv />
                    {t('Cars', { defaultValue: 'Cars' })}
                  </Link>
                </Button>
              </Breadcrumb.Page>
            </Breadcrumb.List>
          </Breadcrumb>
        </PageHeader.Start>
        <PageHeader.End>
          <Badge variant="secondary">
            {t('Records count', {
              count: totalCount,
              defaultValue: '{{count}} records',
            })}
          </Badge>
          <Button onClick={handleOpenCreateCar}>
            <IconPlus className="size-4" />
            {t('Add car', { defaultValue: 'Add car' })}
          </Button>
        </PageHeader.End>
      </PageHeader>

      <PageSubHeader className="flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-72">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={t('Search plate number, VIN, or description', {
                defaultValue: 'Search plate number, VIN, or description',
              })}
              className="pl-9"
            />
          </div>
          <TagFilter value={filters.tag} onValueChange={setTag} />
          <SegmentFilter
            value={filters.segment}
            onValueChange={(segment) => setSegment(segment)}
          />
          {filters.searchValue ||
          filters.tag ||
          filters.segment ||
          filters.categoryId ? (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <IconX className="size-4" />
              {t('Clear filters', { defaultValue: 'Clear filters' })}
            </Button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {selectedCategory ? (
            <Badge variant="secondary">
              <IconFolder className="size-3.5" />
              {selectedCategory.name || selectedCategory.code}
            </Badge>
          ) : null}
          {categoriesLoading ? (
            <span>
              {t('Loading categories...', {
                defaultValue: 'Loading categories...',
              })}
            </span>
          ) : (
            <span>
              {t('categories count', {
                count: carCategories.length,
                defaultValue: '{{count}} categories',
              })}
            </span>
          )}
        </div>
      </PageSubHeader>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <CategoriesSidebar
          categories={carCategories}
          selectedCategoryId={filters.categoryId}
          onSelect={setCategoryId}
          onCreate={handleOpenCategoryCreate}
          onEdit={(category) => {
            setEditingCategory(category);
            setCategoryDialogOpen(true);
          }}
          onDelete={handleDeleteCategory}
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {error ? (
            <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
              <div className="font-medium text-destructive">
                {t('Could not load cars', {
                  defaultValue: 'Could not load cars',
                })}
              </div>
              <p className="mt-1 text-muted-foreground">{error.message}</p>
            </div>
          ) : (
            <>
              <CarsRecordTable
                cars={cars}
                loading={loading}
                totalCount={totalCount}
                sortField={filters.sortField}
                sortDirection={filters.sortDirection}
                onSort={setSort}
                onMergeSelected={(selectedCars) => {
                  setMergeCars(selectedCars);
                  setMergeDialogOpen(true);
                }}
              />
              <PaginationBar
                page={filters.page}
                perPage={filters.perPage}
                totalCount={totalCount}
                onPageChange={setPage}
                onPerPageChange={setPerPage}
              />
            </>
          )}
        </div>
      </div>

      <CarFormSheet
        open={carFormOpen}
        onOpenChange={(open) => {
          setCarFormOpen(open);
          if (!open) {
            setEditingCar(null);
          }
        }}
        car={editingCar}
        categories={carCategories}
      />

      <CategoryFormDialog
        open={categoryDialogOpen}
        onOpenChange={(open) => {
          setCategoryDialogOpen(open);
          if (!open) {
            setEditingCategory(null);
          }
        }}
        category={editingCategory}
        categories={carCategories}
      />

      <MergeCarsDialog
        open={mergeDialogOpen}
        onOpenChange={(open) => {
          setMergeDialogOpen(open);
          if (!open) {
            setMergeCars([]);
          }
        }}
        cars={mergeCars}
        categories={carCategories}
      />
    </PageContainer>
  );
};
