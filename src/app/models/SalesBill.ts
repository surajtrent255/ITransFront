export class SalesBill {
  userId !: number;
  custId !: number;
  companyId !: number;
  fiscalYear !: string;
  billNo !: number;
  billPrinted !: boolean;
  billActive !: boolean;
  realTime !: boolean;
  customerName !: string;
  customerPan !: string;
  billDate !: Date;
  amount !: number;
  discount !: number;
  taxableAmount !: number;
  taxAmount !: number;
  totalAmount !: number;
  syncWithIrd !: boolean;
  printedTime !: string;
  enteredBy !: string;
  printedBy !: string;
  paymentMethod !: string;
  vatRefundAmount !: number;
  transactionId !: string;
  status !: boolean;
}
