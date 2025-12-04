import { InfoCard, InfoCardContent } from '@/block/components/card';
import { ADDRESS_CITY, ADDRESS_DISTRICT } from '@/block/constants/address';
import { useProjectDetail } from '@/project/hooks/useProjectDetail';
import { Input, Label, Select, Textarea } from 'erxes-ui';

export const ProjectAddress = () => {
  const { project } = useProjectDetail();
  const {
    city = 'Улаанбаатар',
    district,
    address,
    lat,
    lng,
  } = project?.location || {};

  return (
    <InfoCard title="Address" description="Project address">
      <InfoCardContent>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <Label asChild>
                <span>City/District</span>
              </Label>
              <Select value={city}>
                <Select.Trigger className="h-8">
                  <Select.Value placeholder="Хотын нэрийг оруулна уу" />
                </Select.Trigger>
                <Select.Content>
                  {ADDRESS_CITY.map((city: string) => (
                    <Select.Item key={city} value={city}>
                      {city}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
            <div className="space-y-2">
              <Label asChild>
                <span>District</span>
              </Label>
              <Select value={district}>
                <Select.Trigger className="h-8">
                  <Select.Value placeholder="Дүүргээ сонгоно уу" />
                </Select.Trigger>
                <Select.Content>
                  {ADDRESS_DISTRICT[city as keyof typeof ADDRESS_DISTRICT]?.map(
                    (district) => (
                      <Select.Item key={district.value} value={district.value}>
                        {district.label}
                      </Select.Item>
                    ),
                  )}
                </Select.Content>
              </Select>
            </div>

            <div className="space-y-2">
              <Label asChild>
                <span>Coordinates</span>
              </Label>
              <div className="flex gap-2">
                <Input placeholder="Latitude" value={lat} />
                <Input placeholder="Longitude" value={lng} />
              </div>
            </div>
          </div>
          <div className="col-span-2 space-y-2 flex flex-col">
            <Label asChild>
              <span>Address</span>
            </Label>
            <Textarea
              className="flex-1"
              placeholder="Хаяг оруулна уу"
              value={address}
            />
          </div>
        </div>
      </InfoCardContent>
    </InfoCard>
  );
};
