export class SalesBill {
  userId !: number;
  custId !: number;
  companyId !: number;
  fiscalYear !: string;//imp
  billNo !: number;//imp
  billPrinted: boolean = false;//imp
  billActive: boolean = true;//imp
  realTime: boolean = true;//imp
  customerName !: string;//imp
  customerPan !: string;//imp
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
}
