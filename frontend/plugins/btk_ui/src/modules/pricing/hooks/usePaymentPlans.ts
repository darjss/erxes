import { useQuery } from '@apollo/client';
import {
  GET_PAYMENT_PLANS_BY_PROJECT,
  GET_PAYMENT_PLAN,
} from '../graphql/paymentPlanQueries';
import { IPaymentPlan } from '../types/paymentPlanTypes';
import { useParams } from 'react-router-dom';
import { useQueryState } from 'erxes-ui';

export const usePaymentPlansByProject = () => {
  const { id } = useParams();
  const [projectId] = useQueryState('projectId');
  const { data, loading, error, refetch } = useQuery<{
    btkGetProjectPaymentPlans: IPaymentPlan[];
  }>(GET_PAYMENT_PLANS_BY_PROJECT, {
    variables: { project: id || projectId },
    skip: !id && !projectId,
  });

  return {
    paymentPlans: data?.btkGetProjectPaymentPlans,
    loading,
    error,
    refetch,
  };
};

export const usePaymentPlan = (paymentPlanId?: string) => {
  const { data, loading, error } = useQuery<{
    btkGetPaymentPlan: IPaymentPlan;
  }>(GET_PAYMENT_PLAN, {
    variables: { id: paymentPlanId },
    skip: !paymentPlanId,
  });

  return {
    paymentPlan: data?.btkGetPaymentPlan,
    loading,
    error,
  };
};
