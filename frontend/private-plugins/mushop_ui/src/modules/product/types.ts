export interface IMushopProductCategory {
  _id?: string;
  name?: string;
  code?: string;
}

export interface IMushopProductSupplier {
  _id?: string;
  name?: string;
  logo?: string;
}

export interface IMushopProduct {
  _id: string;
  name?: string;
  shortName?: string;
  code?: string;
  type?: string;
  description?: string;
  barcodes?: string[];
  variants?: any;
  barcodeDescription?: string;
  unitPrice?: number;
  categoryId?: string;
  category?: IMushopProductCategory;
  vendorId?: string;
  supplier?: IMushopProductSupplier;
  propertiesData?: any;
  tagIds?: string[];
  attachment?: any;
  attachmentMore?: any[];
  scopeBrandIds?: string[];
  uom?: string;
  subUoms?: any;
  currency?: string;
  pdfAttachment?: any;
  status?: string;
  mushopCategoryId?: string;
  mushopCategory?: IMushopProductCategory;
  createdAt?: string;
  updatedAt?: string;
}
