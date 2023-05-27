export class PurchaseBillDetailWithProdInfo {
  id!: number;
  productId!: number;
  qty: number = 0;
  date: Date = new Date();
  discountPerUnit: number = 0.0;
  rate: number = 0.0;
  taxRate!: number;
  purchaseBillId!: number;
  companyId!: number;
  productName!: string;
  debitReason: string = '';
  unit !: string
}
