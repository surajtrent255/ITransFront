import { SalesBill } from "./SalesBill";
import { SalesBillDetailWithProdInfo } from "./SalesBillDetailWithProdInfo";
import { Company } from "./company";

export class SalesBillInvoice {

  salesBillDTO: SalesBill = new SalesBill;
  salesBillDetailsWithProd !: SalesBillDetailWithProdInfo[];
  sellerCompany !: Company;
  customerAddress!: string
}
