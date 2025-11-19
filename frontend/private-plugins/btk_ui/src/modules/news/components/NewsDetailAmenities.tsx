import { InfoCard, InfoCardContent } from '@/btk/components/card';
import { NEWS_AMENITIES } from '~/modules/news/constants/amenities';
import {
  Label,
  Separator,
  Badge,
  Button,
  Combobox,
  Popover,
  Command,
} from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNewsDetail } from '../hooks/useNewsDetail';
import { useUpdateNewsGeneralInfo } from '../hooks/useUpdateNews';

export const NewsDetailAmenities = () => {
  const { news } = useNewsDetail();
  const { updateNewsGeneralInfo } = useUpdateNewsGeneralInfo();
  const [open, setOpen] = useState(false);
  const [newsAmenities, setNewsAmenities] =
    useState<{ category: string; amenities: string[] }[]>();
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (news?.newsAmenities) {
      setNewsAmenities(
        (news?.newsAmenities || []).map((amenity) => ({
          category: amenity.category,
          amenities: amenity.amenities,
        })),
      );
    }
  }, [news?.newsAmenities]);

  const handleSelectAmenity = (amenity: (typeof NEWS_AMENITIES)[0]) => {
    let newAmenityGroups = newsAmenities || [];

    const existingCategory = newsAmenities?.find(
      (a) => a.category === amenity.category_code,
    );

    if (!existingCategory) {
      newAmenityGroups = [
        ...newAmenityGroups,
        { category: amenity.category_code, amenities: [amenity.label_en] },
      ];
    }

    const hasAmenity = existingCategory?.amenities.includes(amenity.label_en);

    newAmenityGroups = newAmenityGroups.map((amenityGroup) =>
      amenityGroup.category === amenity.category_code
        ? {
            ...amenityGroup,
            amenities: hasAmenity
              ? amenityGroup.amenities.filter((am) => am !== amenity.label_en)
              : [...amenityGroup.amenities, amenity.label_en],
          }
        : amenityGroup,
    );
    setIsChanged(true);
    setNewsAmenities(newAmenityGroups);
  };

  const isChecked = (amenity: string, category_code: string) => {
    const existingAmenityGroup = newsAmenities?.find(
      (amenityGroup) => amenityGroup.category === category_code,
    );
    return existingAmenityGroup?.amenities.includes(amenity) || false;
  };

  const amenitiesByCategory = NEWS_AMENITIES.reduce((acc, amenity) => {
    acc[amenity.category_code] = [
      ...(acc[amenity.category_code] || []),
      amenity,
    ];
    return acc;
  }, {} as Record<string, typeof NEWS_AMENITIES>);

  const handleRemoveAmenity = (amenity: string, category_code: string) => {
    updateNewsGeneralInfo(news?._id || '', {
      newsAmenities: newsAmenities
        ?.map((amenityGroup) => {
          if (amenityGroup.category === category_code) {
            return {
              ...amenityGroup,
              amenities: amenityGroup.amenities.filter((am) => am !== amenity),
            };
          }
          return amenityGroup;
        })
        .filter((amenityGroup) => amenityGroup.amenities.length > 0),
    });
  };

  return (
    <div className="p-8 grid-cols-2 grid gap-6">
      <InfoCard title="CATEGORY" description="Amenities" className="col-span-2">
        <InfoCardContent>
          <div className="space-y-2">
            <Label className="block">Category</Label>

            <Popover
              open={open}
              onOpenChange={(open) => {
                setOpen(open);
                if (!open && isChanged) {
                  setIsChanged(false);
                  updateNewsGeneralInfo(news?._id || '', {
                    newsAmenities: newsAmenities,
                  });
                }
              }}
            >
              <Popover.Trigger asChild>
                <Button variant="outline">
                  <IconPlus />
                  Add category
                </Button>
              </Popover.Trigger>
              <Combobox.Content className="min-w-96">
                <Command>
                  <Command.Input />
                  <Command.List>
                    {Object.entries(amenitiesByCategory).map(
                      ([category, amenities]) => (
                        <Command.Group
                          key={category}
                          heading={amenities.at(0)?.category}
                        >
                          {amenities.map((am) => (
                            <Command.Item
                              className="h-auto"
                              key={am.label_en}
                              value={am.label_en}
                              onSelect={() => handleSelectAmenity(am)}
                            >
                              {am.label_en}
                              <Combobox.Check
                                checked={isChecked(
                                  am.label_en,
                                  am.category_code,
                                )}
                              />
                            </Command.Item>
                          ))}
                        </Command.Group>
                      ),
                    )}
                  </Command.List>
                </Command>
              </Combobox.Content>
            </Popover>

            {newsAmenities?.map((amenityGroup) => (
              <div className="pt-2 space-y-2">
                <Label className="block">
                  {amenitiesByCategory[amenityGroup.category].at(0)?.category}
                </Label>
                <div
                  key={amenityGroup.category}
                  className="flex flex-wrap gap-2 items-center "
                >
                  {amenityGroup.amenities.map((am) => (
                    <Badge
                      key={am}
                      variant="secondary"
                      onClose={() =>
                        handleRemoveAmenity(am, amenityGroup.category)
                      }
                    >
                      {am}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </InfoCardContent>
      </InfoCard>
      <Separator className="col-span-2" />
      <InfoCard title="Building Category" description="Amenities">
        <InfoCardContent>
          <div className="p-6 text-accent-foreground">Add buildings first!</div>
        </InfoCardContent>
      </InfoCard>
    </div>
  );
};
