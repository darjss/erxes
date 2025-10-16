import { InfoCard, InfoCardContent } from '@/block/components/card';
import { PROJECT_AMENITIES } from '@/project/constants/project';
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
import { useState } from 'react';

export const ProjectDetailAmenities = () => {
  const [amenities, setAmenities] = useState<string[]>([]);
  return (
    <div className="p-8 grid-cols-2 grid gap-6">
      <InfoCard
        title="AMENITIES"
        description="Amenities"
        className="col-span-2"
      >
        <InfoCardContent>
          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="flex flex-wrap gap-2 items-center">
              {amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary">
                  {amenity}
                </Badge>
              ))}
              <Popover>
                <Popover.Trigger asChild>
                  <Button variant="outline">
                    <IconPlus />
                    Add amenity
                  </Button>
                </Popover.Trigger>
                <Combobox.Content>
                  <Command>
                    <Command.Input />
                    <Command.List>
                      {PROJECT_AMENITIES.map((amenity) => (
                        <Command.Item
                          key={amenity}
                          value={amenity}
                          onSelect={() =>
                            setAmenities(
                              amenities.includes(amenity)
                                ? amenities.filter((a) => a !== amenity)
                                : [...amenities, amenity],
                            )
                          }
                        >
                          {amenity}
                          <Combobox.Check
                            checked={amenities.includes(amenity)}
                          />
                        </Command.Item>
                      ))}
                    </Command.List>
                  </Command>
                </Combobox.Content>
              </Popover>
            </div>
          </div>
        </InfoCardContent>
      </InfoCard>
      <Separator className="col-span-2" />
      <InfoCard title="Building Amenities" description="Amenities">
        <InfoCardContent>
          <div className="p-6 text-accent-foreground">Add buildings first!</div>
        </InfoCardContent>
      </InfoCard>
    </div>
  );
};
