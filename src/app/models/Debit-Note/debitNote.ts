export class DebitNote {
  id!: number;
  panNumber!: number;
  receiverName!: string;
  receiverAddress!: string;
  billNumber!: number;
  date!: Date;
  totalAmount!: number;
  totalTax!: number;
  companyId!: number;
  branchId!: number;
}
