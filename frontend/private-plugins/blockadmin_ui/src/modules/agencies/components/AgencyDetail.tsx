import { Form, Spinner } from 'erxes-ui';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AgencyProfileSchema, useAgencyForm } from '../hooks/useAgencyForm';
import { useAgencyDetail } from '../hooks/useAgencyDetail';
import { AgencyInfoForm } from './AgencyInfoForm';

function removeTypename<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(removeTypename) as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== '__typename')
        .map(([key, val]) => [key, removeTypename(val)]),
    ) as T;
  }
  return value;
}

export const AgencyDetail = () => {
  const { id } = useParams();
  const { agency, loading } = useAgencyDetail({
    variables: { id: id },
  });

  const { form } = useAgencyForm();

  useEffect(() => {
    if (!agency) return;
    const { _id, __typename, ...formDefaultValues } = agency;
    form.reset(removeTypename(formDefaultValues) as AgencyProfileSchema);
  }, [agency]);

  if (loading) {
    return <Spinner containerClassName="ba:py-32" />;
  }

  return (
    <Form {...form}>
      <form className="max-w-2xl mx-auto my-3 space-y-3">
        <AgencyInfoForm form={form} />
      </form>
    </Form>
  );
};
