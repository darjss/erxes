import { gql } from '@apollo/client';

export const UNIT_OFFER_STATS = gql`
  query BlockGetUnitOfferStats($unitId: String!) {
    blockGetUnitOfferStats(unitId: $unitId) {
      totalCount
      sentCount
      draftCount
      averageAmount
      highestAmount
      lowestAmount
      currency
    }
  }
`;

export const UNIT_OFFERS_COUNT = gql`
  query UnitOffersCount($unitId: String!) {
    blockGetOffersList(filter: { unit: $unitId }, limit: 1) {
      totalCount
    }
  }
`;

export const UNIT_CONTRACTS_COUNT = gql`
  query UnitContractsCount($unitId: String!) {
    blockGetContractsList(filter: { unit: $unitId }, limit: 1) {
      totalCount
    }
  }
`;

export const GET_UNIT_PAYMENT_TRANSACTIONS = gql`
  query BlockGetUnitPaymentTransactions($unitId: String!) {
    blockGetUnitPaymentTransactions(unitId: $unitId) {
      _id
      paymentId
      contractId
      amount
      date
      note
      paymentMethod
      createdBy
      createdAt
    }
  }
`;

export const GET_UNIT_PAYMENT_PLAN_DATA = gql`
  query BlockGetUnitPaymentPlanData($unitId: String!) {
    blockGetUnitPaymentPlanData(unitId: $unitId) {
      _id
      index
      label
      dueDate
      amount
      paidAmount
      status
      currency
    }
  }
`;

export const UNIT_OPPTYS_COUNT = gql`
  query UnitOpptysCount($projectId: String!, $unitId: String!) {
    blockGetOpptys(projectId: $projectId, filter: { unit: $unitId }) {
      totalCount
    }
  }
`;

export const UNIT_CONTRACT_OVERVIEW = gql`
  query BlockGetUnitContractOverview($unitId: String!) {
    blockGetUnitContractOverview(unitId: $unitId) {
      total
      stages {
        name
        count
      }
    }
  }
`;

export const UNIT_OPPTY_OVERVIEW = gql`
  query BlockGetUnitOpptyOverview($unitId: String!, $projectId: String!) {
    blockGetUnitOpptyOverview(unitId: $unitId, projectId: $projectId) {
      total
      stages {
        name
        count
      }
    }
  }
`;
