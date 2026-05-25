import { useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { MUSHOP_SUBSCRIPTION_PLANS } from '../../subscription-plan/graphql/queries';
import { PAYMENTS } from '../graphql/payments';
import { MUSHOP_SUBSCRIPTIONS } from '../graphql/queries';
import { IPaymentMethod, ISubscriber, ISubscriptionPlan } from '../types';
import { addMonths } from '../utils/grantHelpers';
import { useGrantSubscription } from './useGrantSubscription';

export const useGrantSheetState = (open: boolean) => {
  const [customerId, setCustomerId] = useState<string>('');
  const [planId, setPlanId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const { data: plansData, loading: plansLoading } = useQuery(
    MUSHOP_SUBSCRIPTION_PLANS,
    {
      variables: { isActive: true },
      skip: !open,
    },
  );

  const { data: subData } = useQuery(MUSHOP_SUBSCRIPTIONS, {
    variables: { searchValue: customerId, status: 'active' },
    skip: !open || !customerId,
    fetchPolicy: 'network-only',
  });

  const { data: paymentsData, loading: paymentsLoading } = useQuery(PAYMENTS, {
    variables: { status: 'active' },
    skip: !open,
  });

  const plans: ISubscriptionPlan[] = plansData?.mushopSubscriptionPlans?.list || [];

  const paymentMethods: IPaymentMethod[] = useMemo(
    () => paymentsData?.payments || [],
    [paymentsData],
  );

  const selectedPlan = plans.find((p) => p._id === planId);

  const selectedPayment = paymentMethods.find((p) => p._id === paymentMethod);
  const isKhanbank = selectedPayment?.kind === 'khanbank';

  const activeSub: ISubscriber | undefined = (
    subData?.mushopSubscriptions?.list as ISubscriber[] | undefined
  )?.find(
    (s) =>
      s.customerId === customerId &&
      s.status === 'active' &&
      (!s.endDate || new Date(s.endDate).getTime() > Date.now()),
  );

  const isExtending = Boolean(activeSub);

  const isSamePlan =
    isExtending && selectedPlan && activeSub?.plan?._id === selectedPlan._id;

  const previewEndDate: Date | null = (() => {
    if (!selectedPlan?.durationMonths) return null;
    const now = new Date();
    const base =
      activeSub?.endDate && new Date(activeSub.endDate) > now
        ? new Date(activeSub.endDate)
        : now;
    return addMonths(base, selectedPlan.durationMonths);
  })();

  const showPreview = isExtending || Boolean(selectedPlan);

  // Autofill amount from plan
  useEffect(() => {
    if (selectedPlan) setAmount(String(selectedPlan.price));
  }, [selectedPlan]);

  // Default payment method to Khanbank if available, else first
  useEffect(() => {
    if (!paymentMethod && paymentMethods.length > 0) {
      const khanbank = paymentMethods.find((p) => p.kind === 'khanbank');
      setPaymentMethod((khanbank || paymentMethods[0])._id);
    }
  }, [paymentMethods, paymentMethod]);

  const reset = () => {
    setCustomerId('');
    setPlanId('');
    setPaymentMethod('');
    setAmount('');
  };

  const { handleGrant, loading: granting } = useGrantSubscription();

  const submit = async () => {
    if (!customerId || !planId) return;
    const numericAmount = amount === '' ? undefined : Number(amount);
    await handleGrant(
      customerId,
      planId,
      paymentMethod || undefined,
      Number.isFinite(numericAmount as number) ? numericAmount : undefined,
    );
  };

  return {
    // form state
    customerId,
    setCustomerId,
    planId,
    setPlanId,
    paymentMethod,
    setPaymentMethod,
    amount,
    setAmount,

    // data
    plans,
    plansLoading,
    paymentMethods,
    paymentsLoading,
    activeSub,

    // derived
    selectedPlan,
    selectedPayment,
    isKhanbank,
    isExtending,
    isSamePlan,
    previewEndDate,
    showPreview,

    // actions
    reset,
    submit,
    granting,
  };
};

export type GrantSheetState = ReturnType<typeof useGrantSheetState>;
