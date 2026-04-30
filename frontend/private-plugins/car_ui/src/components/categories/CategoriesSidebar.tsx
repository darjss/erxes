import { Button, Empty, ScrollArea } from 'erxes-ui';
import {
  IconCarSuv,
  IconFolderPlus,
  IconPencil,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { buildCategoryTree } from '~/lib/categoryTree';
import { ICarCategory, ICategoryTreeNode } from '~/types/car';

const CategoryTreeItem = ({
  node,
  selectedCategoryId,
  onSelect,
  onEdit,
  onDelete,
}: {
  node: ICategoryTreeNode;
  selectedCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
  onEdit: (category: ICarCategory) => void;
  onDelete: (category: ICarCategory) => void;
}) => {
  return (
    <div className="space-y-1">
      <div
        className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
        style={{ paddingLeft: `${node.depth * 14 + 8}px` }}
      >
        <button
          type="button"
          className={`flex flex-1 items-center gap-2 text-left ${
            selectedCategoryId === node._id ? 'text-primary font-medium' : ''
          }`}
          onClick={() =>
            onSelect(selectedCategoryId === node._id ? null : node._id)
          }
        >
          <span className="truncate">{node.name || node.code}</span>
          {node.carCount ? (
            <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
              {node.carCount}
            </span>
          ) : null}
        </button>

        <div className="hidden items-center gap-1 group-hover:flex">
          <Button variant="ghost" size="icon" onClick={() => onEdit(node)}>
            <IconPencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onDelete(node)}
          >
            <IconTrash className="size-4" />
          </Button>
        </div>
      </div>

      {node.children.map((child) => (
        <CategoryTreeItem
          key={child._id}
          node={child}
          selectedCategoryId={selectedCategoryId}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export const CategoriesSidebar = ({
  categories,
  selectedCategoryId,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}: {
  categories: ICarCategory[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
  onCreate: () => void;
  onEdit: (category: ICarCategory) => void;
  onDelete: (category: ICarCategory) => void;
}) => {
  const { t } = useTranslation('car');
  const tree = buildCategoryTree(categories);

  return (
    <aside className="flex w-80 flex-col border-r bg-sidebar/50">
      <div className="flex items-center justify-between gap-3 border-b px-3 py-3">
        <div>
          <div className="text-sm font-semibold">
            {t('Categories', { defaultValue: 'Categories' })}
          </div>
          <div className="text-xs text-muted-foreground">
            {t('Organize and filter the cars list.', {
              defaultValue: 'Organize and filter the cars list.',
            })}
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={onCreate}>
          <IconFolderPlus className="size-4" />
          {t('Add', { defaultValue: 'Add' })}
        </Button>
      </div>

      {selectedCategoryId ? (
        <div className="flex items-center justify-between gap-2 border-b px-3 py-2 text-sm">
          <span className="text-muted-foreground">
            {t('Category filter active', {
              defaultValue: 'Category filter active',
            })}
          </span>
          <Button variant="ghost" size="sm" onClick={() => onSelect(null)}>
            <IconX className="size-4" />
            {t('Clear', { defaultValue: 'Clear' })}
          </Button>
        </div>
      ) : null}

      <ScrollArea className="flex-1">
        {tree.length ? (
          <div className="space-y-1 p-2">
            {tree.map((node) => (
              <CategoryTreeItem
                key={node._id}
                node={node}
                selectedCategoryId={selectedCategoryId}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="p-4">
            <Empty>
              <Empty.Header>
                <Empty.Media variant="icon">
                  <IconCarSuv />
                </Empty.Media>
                <Empty.Title>
                  {t('No categories yet', {
                    defaultValue: 'No categories yet',
                  })}
                </Empty.Title>
                <Empty.Description>
                  {t(
                    'Create the first category to organize cars into a tree.',
                    {
                      defaultValue:
                        'Create the first category to organize cars into a tree.',
                    },
                  )}
                </Empty.Description>
              </Empty.Header>
            </Empty>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
};
