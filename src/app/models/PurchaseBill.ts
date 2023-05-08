export class PurchaseBill {
  userId !: number;
  sellerId !: number;
  companyId !: number;
  branchId !: number;
  fiscalYear !: string;//imp
  purchaseBillNo !: number;//imp
  billPrinted: boolean = false;//imp
  billActive: boolean = true;//imp
  realTime: boolean = true;//imp
  sellerName !: string;//imp
  sellerPan !: number;//imp
  billDate !: Date;//imp
  amount !: number;//imp
  discount !: number;//imp
  taxableAmount !: number;//imp
  taxAmount !: number;//imp
  totalAmount !: number;//imp
  syncWithIrd: boolean = false;//imp
  printedTime !: string;//imp
  enteredBy !: string;//imp
  printedBy !: string;//imp
  paymentMethod !: string;//imp
  vatRefundAmount !: number;//imp if any
  transactionId !: string;//imp if any
  status: boolean = true;
  saleType !: number;

  transportation !: number;
  insurance !: number;
  loading !: number;
  other !: number;

}
