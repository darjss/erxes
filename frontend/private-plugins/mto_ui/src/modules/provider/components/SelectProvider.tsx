import { Checkbox, ScrollArea } from 'erxes-ui';
import { useQuery } from '@apollo/client';
import { ONE_FIT_PROVIDERS } from '../graphql/providerQueries';
import { getLocalizedString } from '~/utils/localization';

interface SelectProviderProps {
  selected?: string[];
  onSelect: (providerIds: string[]) => void;
  disabled?: boolean;
}

export const SelectProvider = ({
  selected = [],
  onSelect,
  disabled = false,
}: SelectProviderProps) => {
  const { data, loading } = useQuery(ONE_FIT_PROVIDERS, {
    variables: {
      isActive: true,
      limit: 100,
    },
  });

  const providers = data?.mtoProviders?.list || [];

  const handleProviderToggle = (providerId: string) => {
    if (disabled) return;

    const isSelected = selected.includes(providerId);
    if (isSelected) {
      onSelect(selected.filter((id) => id !== providerId));
    } else {
      onSelect([...selected, providerId]);
    }
  };

  if (loading) {
    return (
      <div className="py-4 text-sm text-muted-foreground">
        Loading providers...
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="py-4 text-sm text-muted-foreground">
        No providers available
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4">
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {providers.map(
            (provider: {
              _id: string;
              businessName: { en: string; mn: string };
            }) => {
              const isSelected = selected.includes(provider._id);
              const businessName = getLocalizedString(
                provider.businessName,
                'en',
              );
              return (
                <div
                  key={provider._id}
                  className="flex items-center space-x-2 py-1"
                >
                  <Checkbox
                    id={provider._id}
                    checked={isSelected}
                    onCheckedChange={() => handleProviderToggle(provider._id)}
                    disabled={disabled}
                  />
                  <label
                    htmlFor={provider._id}
                    className="text-sm font-medium leading-none cursor-pointer select-none flex-1"
                  >
                    {businessName}
                  </label>
                </div>
              );
            },
          )}
        </div>
      </ScrollArea>
      {selected.length > 0 && (
        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
          {selected.length} provider{selected.length === 1 ? '' : 's'} selected
        </div>
      )}
    </div>
  );
};
