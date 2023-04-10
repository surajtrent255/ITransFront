export class Product {
  id !: number;
  name !: string;
  description !: string;
  sellingPrice !: number;
  costPrice !: number;
  userId !: number;
  companyId !: number;
  sellerId !: number;
  categoryId !: number;
  barcode !: string;
  discount !: number;
  tax: number = 13;
  createDate !: Date;
  updateDate !: Date;

}
