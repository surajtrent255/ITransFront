import { PurchaseComponent } from "../components/shared/purchase/purchase.component";
import { PurchaseBill } from "./PurchaseBill";
import { PurchaseBillDetail } from "./PurchaseBillDetail";
import { SalesBillDetail } from "./SalesBillDetail";

export class PurchaseBillMaster {
  purchaseBillDTO !: PurchaseBill;
  purchaseBillDetails !: PurchaseBillDetail[]
}
