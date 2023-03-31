import { SalesBill } from "./SalesBill";
import { SalesBillDetailWithProdInfo } from "./SalesBillDetailWithProdInfo";

export class SalesBillInvoice {

  salesBillDTO: SalesBill = new SalesBill;
  salesBillDetailsWithProd !: SalesBillDetailWithProdInfo[]
}
