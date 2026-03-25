import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  agencyIdentitySchema,
  agencyBasicInformationSchema,
  agencyIntroductionSchema,
  agencyDocuments,
  agencyFieldsOfExpertiseSchema,
  agencyOperationAreasSchema,
  agencySocialLinksSchema,
} from '../schema/form';
import type { AgencyProfileFormValues } from '../types/form';
import { useUpdateAgency } from './useUpdateAgency';
import { toast } from 'erxes-ui';

export const agencyProfileSchema = agencyIdentitySchema
  .merge(agencyBasicInformationSchema)
  .merge(agencyIntroductionSchema)
  .merge(agencyDocuments)
  .merge(agencyFieldsOfExpertiseSchema)
  .merge(agencyOperationAreasSchema)
  .merge(agencySocialLinksSchema);

export type AgencyProfileSchema = z.infer<typeof agencyProfileSchema>;

export const useAgencyProfileForm = (
  defaultValues?: Partial<AgencyProfileFormValues>,
) => {
  const { updateAgency, loading } = useUpdateAgency();

  const form = useForm<AgencyProfileSchema>({
    resolver: zodResolver(agencyProfileSchema),
    defaultValues: {
      name: '',
      type: 'agency',
      brandName: '',
      dateFounded: '',
      brief: '',
      website: '',
      emails: [],
      phones: [],
      primaryEmail: '',
      primaryPhone: '',
      description: '',
      documents: [],
      fieldsOfExpertise: { propertyTypes: [], services: [], clientTypes: [] },
      operationArea: { city: '', district: '' },
      socialLinks: { facebook: '' },
      ...defaultValues,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateAgency({
      variables: {
        input: values,
      },
      onCompleted: () => {
        toast({ variant: 'success', title: 'Profile updated successfully' });
      },
      onError: (error) =>
        toast({
          variant: 'destructive',
          title: 'Update failed. Please try again.',
          description: error.message,
        }),
    });
  });

  return {
    form,
    onSubmit,
    loading,
  };
};
