import { UseFormReturn } from 'react-hook-form';
import { SelectPropertyType } from '../property/SelectPropertyType';
import { SelectService } from '../property/SelectService';
import { SelectClientType } from '../property/SelectClientType';
import { MultipleDocumentUpload } from './MultipleDocumentUpload';
import { UploadImage } from './upload';
import {
  Form,
  InfoCard,
  Input,
  Textarea,
  Select,
  Label,
  Button,
} from 'erxes-ui';
import { AgencyProfileSchema } from '~/modules/blockagent/components/agency/hooks/useAgencyProfileForm';
import { SelectArea } from './SelectArea';
import { AgencyPhones } from './AgencyPhones';
import { AgencyEmails } from './AgencyEmails';
import { SocialLinkInput } from './SocialLinkInput';
import { useEffect, useState } from 'react';
import { SocialPlatform } from '../types/form';
import { socialPlatforms } from '../constants/social-platforms';
import { IconPlus, IconTrash } from '@tabler/icons-react';

type Props = {
  form: UseFormReturn<AgencyProfileSchema>;
  isPending: boolean;
  _id?: string;
};

export const AgencyForm = ({ form, _id, isPending }: Props) => {
  const logo = form.watch('logo');
  const coverImage = form.watch('coverImage');
  const city = form.watch('operationArea.city');
  return (
    <>
      <div className="grid grid-cols-2">
        <Form.Field<AgencyProfileSchema, 'logo'>
          name="logo"
          control={form.control}
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Logo</Form.Label>
              <UploadImage
                value={logo}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                className="size-16"
                disabled={isPending}
              />
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field<AgencyProfileSchema, 'coverImage'>
          name="coverImage"
          control={form.control}
          render={({ field }) => (
            <Form.Item className="col-span-2">
              <Form.Label>Cover Image</Form.Label>
              <UploadImage
                value={coverImage}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                uploaderClassName="w-full"
                className="w-full aspect-video"
                disabled={isPending}
              />
              <Form.Message />
            </Form.Item>
          )}
        />
      </div>

      <InfoCard title="Basic Information">
        <InfoCard.Content className="grid grid-cols-2">
          <Form.Field<AgencyProfileSchema, 'name'>
            control={form.control}
            name="name"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Official Name</Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    placeholder="Official company name"
                    disabled={isPending}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field<AgencyProfileSchema, 'brandName'>
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Brand Name</Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    placeholder="Brand name"
                    disabled={isPending}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field<AgencyProfileSchema, 'dateFounded'>
            control={form.control}
            name="dateFounded"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Established Year</Form.Label>
                <Form.Control>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
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
          <Form.Field<AgencyProfileSchema, 'website'>
            control={form.control}
            name="website"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Website</Form.Label>
                <Form.Control>
                  <Input
                    placeholder="https://www.example.com"
                    {...field}
                    disabled={isPending}
                  />
                </Form.Control>
              </Form.Item>
            )}
          />
        </InfoCard.Content>
      </InfoCard>

      <InfoCard title="Introduction">
        <InfoCard.Content className="gap-1">
          <Form.Field<AgencyProfileSchema, 'brief'>
            control={form.control}
            name="brief"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Brief Info</Form.Label>
                <Form.Control>
                  <Textarea
                    maxLength={300}
                    {...field}
                    placeholder="Max 300 characters…"
                    disabled={isPending}
                  />
                </Form.Control>
                <Form.Description className="text-right">
                  {(field.value as string)?.length}/300 characters
                </Form.Description>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field<AgencyProfileSchema, 'description'>
            control={form.control}
            name="description"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Full Description</Form.Label>
                <Form.Control>
                  <Textarea
                    {...field}
                    placeholder="Full agency description"
                    disabled={isPending}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </InfoCard.Content>
      </InfoCard>

      <div className="grid grid-cols-2">
        <Form.Field<AgencyProfileSchema, 'documents'>
          control={form.control}
          name="documents"
          render={({ field }) => (
            <Form.Item className="col-span-2">
              <Form.Label>Documents</Form.Label>
              <Form.Control>
                <MultipleDocumentUpload
                  value={field.value as string[]}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              </Form.Control>
              <Form.Description>
                Байгууллагын холбогдох баримт бичигийг энэ хэсэгт оруулна.
              </Form.Description>
              <Form.Message />
            </Form.Item>
          )}
        />
      </div>

      <InfoCard title="Field of Activity">
        <InfoCard.Content className="grid grid-cols-3">
          <Form.Field<AgencyProfileSchema, 'fieldsOfExpertise.propertyTypes'>
            control={form.control}
            name="fieldsOfExpertise.propertyTypes"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Property Types</Form.Label>
                <Form.Control>
                  <SelectPropertyType
                    value={
                      field.value as (
                        | 'RESIDENTIAL'
                        | 'HOUSE'
                        | 'LAND'
                        | 'COMMERCIAL'
                        | 'OFFICE'
                      )[]
                    }
                    onValueChange={field.onChange}
                    disabled={isPending}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field<AgencyProfileSchema, 'fieldsOfExpertise.services'>
            control={form.control}
            name="fieldsOfExpertise.services"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Services</Form.Label>
                <Form.Control>
                  <SelectService
                    value={
                      field.value as (
                        | 'SALES'
                        | 'RENTAL'
                        | 'BROKERAGE'
                        | 'VALUATION'
                        | 'INVESTMENT_ADVISORY'
                        | 'PROPERTY_MANAGEMENT'
                      )[]
                    }
                    onValueChange={field.onChange}
                    disabled={isPending}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field<AgencyProfileSchema, 'fieldsOfExpertise.clientTypes'>
            control={form.control}
            name="fieldsOfExpertise.clientTypes"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Client Types</Form.Label>
                <Form.Control>
                  <SelectClientType
                    value={
                      field.value as (
                        | 'INDIVIDUAL_BUYER'
                        | 'INVESTOR'
                        | 'CORPORATE_CLIENT'
                        | 'DEVELOPER'
                      )[]
                    }
                    onValueChange={field.onChange}
                    disabled={isPending}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </InfoCard.Content>
      </InfoCard>

      <InfoCard title="Operation Area">
        <InfoCard.Content className="grid grid-cols-2">
          <Form.Field<AgencyProfileSchema, 'operationArea.city'>
            control={form.control}
            name="operationArea.city"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>City</Form.Label>
                <Form.Control>
                  <SelectArea
                    city={city}
                    onCityChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectArea.City />
                  </SelectArea>
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field<AgencyProfileSchema, 'operationArea.district'>
            control={form.control}
            name="operationArea.district"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>District</Form.Label>
                <Form.Control>
                  <SelectArea
                    city={city}
                    district={field.value}
                    onDistrictChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectArea.District />
                  </SelectArea>
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </InfoCard.Content>
      </InfoCard>

      <ContactInfoSection
        form={form}
        _id={_id as string}
        isPending={isPending}
      />

      <InfoCard title="Social links">
        <InfoCard.Content>
          <SocialLinksField form={form} disabled={isPending} />
        </InfoCard.Content>
      </InfoCard>
    </>
  );
};

export const ContactInfoSection = ({
  form,
  _id,
  isPending,
}: {
  form: UseFormReturn<AgencyProfileSchema>;
  _id?: string;
  isPending?: boolean;
}) => {
  const [emails, phones, primaryEmail, primaryPhone] = form.watch([
    'emails',
    'phones',
    'primaryEmail',
    'primaryPhone',
  ]);
  return (
    <InfoCard
      title="Contact info"
      description="Add one or more phone numbers and email addresses. Mark one of each as primary for main contact."
    >
      <InfoCard.Content className="grid grid-cols-2 gap-x-2">
        <div className="w-full">
          <Label className="mb-2">Phones</Label>
          <AgencyPhones
            _id={_id as string}
            phones={phones as string[]}
            primaryPhone={primaryPhone as string}
            onValueChange={({
              phones: updatedPhones,
              primaryPhone: updatedPrimaryPhone,
            }) => {
              form.setValue('phones', updatedPhones);
              form.setValue('primaryPhone', updatedPrimaryPhone);
            }}
            disabled={isPending}
          />
        </div>

        <div className="w-full">
          <Label className="mb-2">Emails</Label>
          <AgencyEmails
            _id={_id as string}
            emails={emails as string[]}
            primaryEmail={primaryEmail as string}
            onValueChange={({
              emails: updatedEmails,
              primaryEmail: updatedPrimaryEmail,
            }) => {
              form.setValue('emails', updatedEmails);
              form.setValue('primaryEmail', updatedPrimaryEmail);
            }}
            disabled={isPending}
          />
        </div>
      </InfoCard.Content>
    </InfoCard>
  );
};

export const SocialLinksField = ({
  form,
  disabled = false,
}: {
  form: UseFormReturn<AgencyProfileSchema>;
  disabled?: boolean;
}) => {
  const socialLinks = form.watch('socialLinks');
  const agencySocialPlatforms = Object.keys(
    socialLinks ?? {},
  ) as SocialPlatform[];
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(
    agencySocialPlatforms.length > 0 ? agencySocialPlatforms : ['facebook'],
  );

  useEffect(() => {
    if (agencySocialPlatforms.length > 0) {
      setPlatforms(agencySocialPlatforms);
    }
  }, [socialLinks]);

  const usedPlatforms = platforms;
  const availablePlatforms = socialPlatforms.filter(
    (p) => !usedPlatforms.includes(p),
  );

  const addRow = () => {
    if (availablePlatforms.length === 0) return;
    setPlatforms((prev) => [...prev, availablePlatforms[0]]);
  };

  const removeRow = (platform: SocialPlatform) => {
    setPlatforms((prev) => prev.filter((p) => p !== platform));
    form.setValue(`socialLinks.${platform}`, undefined);
  };

  return (
    <fieldset className="space-y-3">
      <legend className="font-mono uppercase font-semibold text-xs text-accent-foreground">
        Social Links
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {platforms.map((platform) => (
          <Form.Field<AgencyProfileSchema, `socialLinks.${typeof platform}`>
            control={form.control}
            name={`socialLinks.${platform}`}
            render={({ field }) => (
              <Form.Item className="grow flex items-start gap-2 w-full">
                <Form.Control>
                  <SocialLinkInput
                    {...field}
                    value={(field.value as string) ?? ''}
                    placeholder={`https://${platform}.com/...`}
                    disabled={disabled}
                  />
                </Form.Control>
                <Form.Message />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(platform)}
                  disabled={disabled}
                  className="hover:text-destructive"
                >
                  <IconTrash size={16} />
                </Button>
              </Form.Item>
            )}
          />
        ))}
      </div>
      {availablePlatforms.length > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          disabled={disabled}
          className="w-full"
        >
          <IconPlus size={14} className="mr-1" />
          Add social link
        </Button>
      )}
    </fieldset>
  );
};
