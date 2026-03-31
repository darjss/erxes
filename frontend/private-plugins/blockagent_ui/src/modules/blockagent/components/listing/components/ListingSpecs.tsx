import { UseFormReturn } from 'react-hook-form';
import { IListing } from '../types/listing';
import { Form, InfoCard, Input, Select } from 'erxes-ui';

type Props = {
  form: UseFormReturn<IListing>;
};

export const ListingSpecs: React.FC<Props> = ({ form }) => {
  const { control } = form;

  return (
    <InfoCard title="Specifications">
      <InfoCard.Content className="grid grid-cols-3 gap-4">
        <Form.Field<IListing, 'specs.area'>
          control={control}
          name="specs.area"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Area (m²)</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field<IListing, 'specs.floor'>
          control={control}
          name="specs.floor"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Floor</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                  placeholder="Optional"
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field<IListing, 'specs.totalFloors'>
          control={control}
          name="specs.totalFloors"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Total Floors</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                  placeholder="Optional"
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field<IListing, 'specs.rooms'>
          control={control}
          name="specs.rooms"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Rooms</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                  placeholder="Optional"
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field<IListing, 'specs.builtYear'>
          control={control}
          name="specs.builtYear"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Built Year</Form.Label>
              <Form.Control>
                <Select value={field.value} onValueChange={field.onChange}>
                  <Select.Trigger>
                    <Select.Value placeholder="Select date" />
                  </Select.Trigger>
                  <Select.Content>
                    {Array.from({ length: 100 }).map((_, index) => (
                      <Select.Item
                        key={index}
                        value={`${new Date().getFullYear() - index}`}
                      >
                        {new Date().getFullYear() - index}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
      </InfoCard.Content>
    </InfoCard>
  );
};
