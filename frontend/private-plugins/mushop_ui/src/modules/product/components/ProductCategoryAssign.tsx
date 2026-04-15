import { useState } from 'react';
import { Combobox, Command, Popover, ComboboxTriggerIcon } from 'erxes-ui';
import { useCoreProductCategories, useAssignProductCategory } from '../hooks/useAssignProductCategory';
import { IMushopProductCategory } from '../types';

export const ProductCategoryAssign = ({
  productId,
  mushopCategoryId,
  mushopCategory,
}: {
  productId: string;
  mushopCategoryId?: string;
  mushopCategory?: IMushopProductCategory;
}) => {
  const [search, setSearch] = useState('');
  const { categories, loading } = useCoreProductCategories(search || undefined);
  const { assign, loading: assigning } = useAssignProductCategory();

  const handleSelect = (categoryId: string) => {
    const newId = categoryId === mushopCategoryId ? undefined : categoryId;
    assign({ variables: { _id: productId, mushopCategoryId: newId || null } });
  };

  return (
    <Popover>
      <Combobox.TriggerBase className="h-8 text-sm font-normal w-full max-w-64">
        <Combobox.Value
          value={mushopCategory?.name}
          placeholder="Assign category..."
          loading={assigning}
        />
        <ComboboxTriggerIcon className="ml-auto" />
      </Combobox.TriggerBase>
      <Combobox.Content>
        <Command shouldFilter={false}>
          <Command.Input
            placeholder="Search categories..."
            value={search}
            onValueChange={setSearch}
          />
          <Command.List>
            {loading && <Command.Item disabled>Loading...</Command.Item>}
            <Command.Empty>No categories found.</Command.Empty>
            <Command.Group>
              {mushopCategoryId && (
                <Command.Item
                  onSelect={() =>
                    assign({
                      variables: { _id: productId, mushopCategoryId: null },
                    })
                  }
                >
                  <span className="text-muted-foreground">Clear category</span>
                </Command.Item>
              )}
              {categories.map((cat) => (
                <Command.Item
                  key={cat._id}
                  value={cat._id}
                  onSelect={() => handleSelect(cat._id!)}
                >
                  {cat.name}
                  <Combobox.Check checked={cat._id === mushopCategoryId} />
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};
