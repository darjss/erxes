import { UseFormReturn } from 'react-hook-form';
import { IListing } from '../types/listing';
import { Form, InfoCard } from 'erxes-ui';
import { UploadAttachments } from '../../agency/form/upload';

type Props = {
  form: UseFormReturn<IListing>;
};

export const ListingMediaAttachments: React.FC<Props> = ({ form }) => {
  const { control, watch, setValue } = form;
  const featuredImg = watch('featuredImg');

  return (
    <InfoCard
      title="Media"
      description="Upload photos for the listing. Click the star on any image to set it as the featured cover photo."
    >
      <InfoCard.Content>
        <Form.Field<IListing, 'mediaAttachments'>
          control={control}
          name="mediaAttachments"
          render={({ field }) => (
            <Form.Item>
              <Form.Control>
                <UploadAttachments
                  values={field.value as string[]}
                  onValueChange={(values) => {
                    field.onChange(values);
                  }}
                  featured={featuredImg ?? undefined}
                  setFeatured={(url) => setValue('featuredImg', url)}
                  className="size-auto"
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
      </InfoCard.Content>
    </InfoCard>
  );
};
