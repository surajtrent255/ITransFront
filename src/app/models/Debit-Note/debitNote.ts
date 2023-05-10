export class DebitNote {
  id!: number;
  panNumber!: number;
  receiverName!: string;
  receiverAddress!: string;
  billNumber!: string;
  date!: Date;
  totalAmount!: number;
  totalTax!: number;
}
