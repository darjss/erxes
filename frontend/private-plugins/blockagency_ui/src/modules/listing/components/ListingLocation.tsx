import { UseFormReturn } from 'react-hook-form';
import { IListing } from '../types/listing';
import { Form, InfoCard, Input, Textarea } from 'erxes-ui';
import { SelectArea } from '../../agency/form/SelectArea';
import { GoogleMap } from './GoogleMap';

type Props = {
  form: UseFormReturn<IListing>;
};

export const ListingLocation: React.FC<Props> = ({ form }) => {
  const { control, watch } = form;
  const [city, district] = watch(['location.city', 'location.district']);

  const handleMapSelect = (value: {
    lat: number;
    lng: number;
    city?: string;
    district?: string;
    subDistrict?: string;
  }) => {
    const { lat, lng, city, district, subDistrict } = value || {};

    form.setValue('location.lat', lat);
    form.setValue('location.lng', lng);
    form.setValue('location.city', city || '');
    form.setValue('location.district', district || '');
    form.setValue('location.subDistrict', subDistrict || '');
  };

  return (
    <InfoCard title="Location">
      <InfoCard.Content className="flex gap-4">
        <div className="grid grid-cols-3 gap-4">
          {/* city */}
          <Form.Field<IListing, 'location.city'>
            control={control}
            name="location.city"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>City</Form.Label>
                <Form.Control>
                  <SelectArea city={city} onCityChange={field.onChange}>
                    <SelectArea.City />
                  </SelectArea>
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          {/* district */}
          <Form.Field<IListing, 'location.district'>
            control={control}
            name="location.district"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>District</Form.Label>
                <Form.Control>
                  <SelectArea
                    city={city}
                    district={district}
                    onDistrictChange={field.onChange}
                  >
                    <SelectArea.District />
                  </SelectArea>
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          {/* sub district */}
          <Form.Field<IListing, 'location.subDistrict'>
            control={control}
            name="location.subDistrict"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Sub-district</Form.Label>
                <Form.Control>
                  <Input {...field} placeholder="Sub-district" />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </div>
        <div className="gap-4 grid grid-cols-3">
          <div className="col-span-1 flex flex-col gap-4">
            {/* short */}
            <Form.Field<IListing, 'location.short'>
              control={control}
              name="location.short"
              render={({ field }) => (
                <Form.Item className="col-span-2">
                  <Form.Label>Short Address</Form.Label>
                  <Form.Control>
                    <Textarea {...field} placeholder="Short address" />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            {/* lat & lng */}
            <Form.Field<IListing, 'location.lat'>
              control={control}
              name="location.lat"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control>
                    <Input
                      placeholder="Latitude"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field<IListing, 'location.lng'>
              control={control}
              name="location.lng"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control>
                    <Input
                      placeholder="Longitude"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
          <div className="col-span-2 flex flex-col space-y-2 col-span-2 rounded-sm overflow-hidden">
            <GoogleMap
              coordinate={{
                lat: form.watch('location.lat'),
                lng: form.watch('location.lng'),
              }}
              onSelect={handleMapSelect}
            />
          </div>
        </div>
      </InfoCard.Content>
    </InfoCard>
  );
};
