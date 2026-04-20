export interface ISubmissionOffering {
  price?: number;
  stock?: number;
  minBuyCount?: number;
  maxBuyCount?: number;
  groupBuyMinCount?: number;
  groupBuyDiscount?: number;
  warrantyDuration?: number;
}

export interface ISubmission {
  _id: string;
  productId: string;
  supplierId: string;
  status: string;
  note?: string;
  offering?: ISubmissionOffering;
  submittedAt?: string;
  decidedAt?: string;
}

export interface ISubmissionList {
  list: ISubmission[];
  totalCount?: number;
  pageInfo?: { startCursor?: string | null; endCursor?: string | null; hasNextPage: boolean; hasPreviousPage: boolean };
}
