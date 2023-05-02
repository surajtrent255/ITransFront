export class Product {
  id !: number;
  name !: string;
  description !: string;
  sellingPrice !: number;
  costPrice !: number;
  userId !: number;
  companyId !: number;
  branchId !: number;
  sellerId !: number;
  categoryId !: number;
  barcode !: string;
  discount: number = 0;
  tax: number = 13;
  createDate !: Date;
  updateDate !: Date;
  stock !: number;

}
