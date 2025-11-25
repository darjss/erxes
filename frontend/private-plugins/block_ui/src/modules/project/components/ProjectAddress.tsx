import { InfoCard, InfoCardContent } from '@/block/components/card';
import { ADDRESS_CITY, ADDRESS_DISTRICT } from '@/project/constants/address';
import { useProjectDetail } from '@/project/hooks/useProjectDetail';
import { useUpdateProjectGeneralInfo } from '@/project/hooks/useUpdateProject';
import { IProjectLocation } from '@/project/types/projectTypes';
import { Input, Label, Select, Textarea } from 'erxes-ui';
import { useState } from 'react';

export const ProjectAddress = () => {
  const { project } = useProjectDetail();
  const { city, district, address, parcelId } = project?.location || {};
  const { updateProjectGeneralInfo } = useUpdateProjectGeneralInfo();
  const [selectedCity, setSelectedCity] = useState<string>(
    city || 'Улаанбаатар',
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    district || '',
  );
  const [addressValue, setAddressValue] = useState<string>(address || '');
  const [parcelIdValue, setParcelIdValue] = useState<string>(parcelId || '');

  const handleUpdateProjectLocation = (location: IProjectLocation) => {
    updateProjectGeneralInfo(project?._id || '', {
      name: project?.name || '',
      location: {
        city,
        district,
        address,
        parcelId,
        ...location,
      },
    });
  };

  return (
    <InfoCard title="Address" description="Project address">
      <InfoCardContent>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <Label asChild>
                <span>City/District</span>
              </Label>
              <Select
                value={selectedCity}
                onValueChange={(value) => {
                  setSelectedCity(value);
                  handleUpdateProjectLocation({
                    city: value,
                    district: '',
                  });
                  setSelectedDistrict('');
                }}
              >
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
              <Select
                value={selectedDistrict}
                onValueChange={(value) => {
                  setSelectedDistrict(value);
                  handleUpdateProjectLocation({
                    district: value,
                  });
                }}
              >
                <Select.Trigger className="h-8">
                  <Select.Value placeholder="Дүүргээ сонгоно уу" />
                </Select.Trigger>
                <Select.Content>
                  {ADDRESS_DISTRICT[
                    selectedCity as keyof typeof ADDRESS_DISTRICT
                  ]?.map((district) => (
                    <Select.Item key={district.value} value={district.value}>
                      {district.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
            <div className="space-y-2">
              <Label asChild>
                <span>Address</span>
              </Label>
              <Textarea
                placeholder="Хаяг оруулна уу"
                value={addressValue}
                onChange={(e) => setAddressValue(e.target.value)}
                onBlur={() => {
                  handleUpdateProjectLocation({
                    address: addressValue,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label asChild>
                <span>Parcel Id</span>
              </Label>
              <Input
                placeholder="Кадастр оруулна уу"
                value={parcelIdValue}
                onChange={(e) => setParcelIdValue(e.target.value)}
                onBlur={() => {
                  handleUpdateProjectLocation({
                    parcelId: parcelIdValue,
                  });
                }}
              />
            </div>
          </div>
          <div className="col-span-2 h-full w-full bg-gray-200 flex justify-center items-center">
            Google Map
          </div>
        </div>
      </InfoCardContent>
    </InfoCard>
  );
};
