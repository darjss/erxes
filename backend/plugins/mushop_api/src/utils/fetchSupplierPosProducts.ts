import { isDev } from 'erxes-api-shared/utils';

const { SUPPLIER_API_URL } = process.env;

const POS_PRODUCTS_QUERY = `
  query PoscProducts($perPage: Int) {
    poscProducts(perPage: $perPage) {
      _id: String!
      name: String
      description: String
      attachment: Attachment
      code: String
      shortName: String
      type: String
      barcodes: [String]
      barcodeDescription: String
      unitPrice: Float
      savedRemainder: Float
      categoryId: String
      customFieldsData: JSON
      customFieldsDataByFieldCode: JSON
      propertiesData: JSON
      createdAt: Date
      tagIds: [String]
      vendorId: String
      attachmentMore: [Attachment]
      uom: String
      subUoms: JSON
      currency: String
      category: PosProductCategory

      remainder: Float
      soonIn: Float
      soonOut: Float
      remainders: [JSON]
      
      isCheckRem: Boolean
      hasSimilarity: Boolean
      pdfAttachment: PdfAttachment
      category {
        _id
        name
        code
        order
        parentId
      }
    }
  }
`;

export const fetchSupplierPosProducts = async ({
  subdomain,
  posToken,
}: {
  subdomain: string;
  posToken: string;
}): Promise<any[]> => {
  if (!SUPPLIER_API_URL) return [];

  const url = isDev
    ? 'http://localhost:4000'
    : SUPPLIER_API_URL.replace('<subdomain>', subdomain);

  const res = await fetch(`${url}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'erxes-pos-token': posToken,
    },
    body: JSON.stringify({
      query: POS_PRODUCTS_QUERY,
      variables: { perPage: 9999 },
    }),
    signal: AbortSignal.timeout(30000),
  });

  console.log('res', res);

  if (!res.ok) {
    console.error(
      `fetchSupplierPosProducts: HTTP ${res.status} from ${url}/graphql`,
    );
    return [];
  }

  const json: any = await res.json();

  if (json?.errors?.length) {
    console.error('fetchSupplierPosProducts GQL errors:', json.errors);
  }

  return json?.data?.poscProducts ?? [];
};
