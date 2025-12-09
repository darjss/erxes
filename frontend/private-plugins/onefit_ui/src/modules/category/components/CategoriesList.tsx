import { ColumnDef } from '@tanstack/table-core';
import {
  Badge,
  Button,
  RecordTable,
  RecordTableInlineCell,
  RecordTableTree,
  RelativeDateDisplay,
} from 'erxes-ui';
import { useCategories } from '../hooks/useCategories';
import { CategoryFilters } from '../types/category';
import { CATEGORIES_CURSOR_SESSION_KEY } from '../constants/categoryCursorSessionKey';
import { EditCategoryDialog } from './EditCategoryDialog';
import { RemoveCategoryDialog } from './RemoveCategoryDialog';
import { useState, useMemo } from 'react';
import { generateOrderPath } from '../utils/generateOrderPath';

interface CategoriesListProps {
  filters?: CategoryFilters;
}

export const CategoriesList = ({ filters }: CategoriesListProps) => {
  const { categories, handleFetchMore, loading, pageInfo } =
    useCategories(filters);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null,
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  const categoriesWithOrder = useMemo(() => {
    if (!categories) return [];
    return generateOrderPath(categories);
  }, [categories]);

  const categoryObject = useMemo(() => {
    return categoriesWithOrder.reduce(
      (acc, category) => {
        acc[category._id] = category;
        return acc;
      },
      {} as Record<string, typeof categoriesWithOrder[0]>,
    );
  }, [categoriesWithOrder]);

  const columns: ColumnDef<
    typeof categoriesWithOrder[0] & { hasChildren: boolean }
  >[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ cell, row }) => {
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            <RecordTableTree.Trigger
              order={row.original.order}
              name={cell.getValue() as string}
              hasChildren={row.original.hasChildren}
            >
              {cell.getValue() as string}
            </RecordTableTree.Trigger>
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ cell }) => {
        const description = cell.getValue() as string | undefined;
        return (
          <RecordTableInlineCell className="text-xs font-medium text-muted-foreground">
            {description || '-'}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ cell }) => {
        const isActive = cell.getValue() as boolean;
        return (
          <RecordTableInlineCell>
            <Badge variant={isActive ? 'success' : 'secondary'}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ cell }) => {
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            <RelativeDateDisplay value={cell.getValue() as string} asChild>
              <RelativeDateDisplay.Value value={cell.getValue() as string} />
            </RelativeDateDisplay>
          </RecordTableInlineCell>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const category = row.original;

        return (
          <RecordTableInlineCell>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory(category._id);
                  setEditDialogOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory(category._id);
                  setRemoveDialogOpen(true);
                }}
              >
                Remove
              </Button>
            </div>
          </RecordTableInlineCell>
        );
      },
    },
  ];

  return (
    <>
      <RecordTable.Provider
        columns={columns}
        data={categoriesWithOrder}
        className="m-3"
      >
        <RecordTableTree id="categories" ordered>
          <RecordTable.Scroll>
            <RecordTable>
              <RecordTable.Header />
              <RecordTable.Body>
                {loading && <RecordTable.RowSkeleton rows={40} />}
                <RecordTable.RowList Row={RecordTableTree.Row} />
              </RecordTable.Body>
            </RecordTable>
          </RecordTable.Scroll>
        </RecordTableTree>
      </RecordTable.Provider>

      {selectedCategory && (
        <>
          <EditCategoryDialog
            categoryId={selectedCategory}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
              setSelectedCategory(null);
            }}
          />
          <RemoveCategoryDialog
            categoryId={selectedCategory}
            open={removeDialogOpen}
            onOpenChange={setRemoveDialogOpen}
            onClose={() => {
              setRemoveDialogOpen(false);
              setSelectedCategory(null);
            }}
          />
        </>
      )}
    </>
  );
};

