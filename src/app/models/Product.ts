export class Product {
  id !: number;
  name !: string;
  description !: string;
  sellingPrice : number=0;
  costPrice: number=0;
  userId !: number;
  companyId !: number;
  branchId !: number;
  sellerId !: number;
  categoryId !: number;
  barcode !: string;
  discount: number = 0;
  tax!: number ;
  unit!:string;
  createDate !: Date;
  updateDate !: Date;
  vatRate!: number;

}
