import { Component } from '@angular/core';
import { from } from 'rxjs';
import { Deposit } from 'src/app/models/BankDeposite';
import { ToastrService } from 'ngx-toastr';
import { BankdepositeService } from 'src/app/service/shared/bankdeposite/bankdeposite.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { Bank } from 'src/app/models/Bank';

@Component({
  selector: 'app-bank-deposit',
  templateUrl: './bank-deposit.component.html',
  styleUrls: ['./bank-deposit.component.css']
})
export class BankDepositComponent {

  depositId!:number;
  bankId!:number;
  branchId!:number;
  companyId!:number;
  depositAmount!:number;
  depositeType!:string;
  chequeNumber!:string;;
  Deposite:Deposit[]=[];
  banks: Bank[] = [];
  showForm!: boolean;
  localStorageCompanyId!:string;

  objdeposite:Deposit = new Deposit;

  constructor(private bankdepositeService:BankdepositeService,
    private bankService: BankService,
    private loginService:LoginService , 
    private toastrService:ToastrService){}
  ngOnInit() {
    
    // const data = localStorage.getItem('companyDetails');
    // const parsedData = JSON.parse(data || '{}');
    // const { companyId } = parsedData;
    // this.localStorageCompanyId = companyId;


    this.companyId =this.loginService.getCompnayId();
    this.branchId =this.loginService.getBranchId();
    this.getAllBankDeposite();
   
  
   
  

  }
  fetchRelatedBanks() {
    this.bankService.getAllBanks(this.companyId,this.branchId).subscribe((data) => {
      this.banks = data.data
    })
  }
  getAllBankDeposite(){
    this.bankdepositeService.getAlldeposite(this.companyId,this.branchId).subscribe(res => {
      console.log(res.data)
      this.Deposite = res.data;
    });

  }
  openForm() {
    this.resetForm();
    console.log('Opening form...');
    this.fetchRelatedBanks();
    // console.log(this.banks[0])
    // Reset form data
    this.companyId = this.companyId;
    this.branchId = this.branchId;
    this.showForm = true;

    // Show form
   
    const bankForm = document.getElementById('createNewCategoryPopup');
  if (bankForm) {
    bankForm.style.display = 'block';
  }
  }



creatdepostie(form:any)
{
  
  this.showForm=false;
  this.objdeposite.companyId=this.companyId;
  this.objdeposite.branchId=this.branchId;
  this.objdeposite.submiteDate=new Date();
  console.log(this.objdeposite);
  this.bankdepositeService.addDeposite(this.objdeposite).subscribe({
    next:(data)=>{
      this.toastrService.success("deposite added sucessfull"+data.bankId);
      this.getAllBankDeposite();
    
    },error:(err)=>{
      this.toastrService.error("something wrong");
    }
  })



  
  // submitForm() {
  //   // if (this.bankId.trim() === '' || this.depositAmount.trim() === '' || this.depositeType.trim() === '' || this.chequeNumber.trim() === '') {
  //   //   alert('Please fill in all fields');
  //   //   return;
  //   // }
  
  //   // Replace this with the code that handles the form data
  //   console.log('Company ID:', this.companyId);
  //   console.log('Branch ID:', this.branchId);
  //   console.log('Bank ID:', this.bankId);
  //   console.log('depositAmount:', this.depositAmount);
  //   // console.log('Initial Amount:', this.initialAmount);
  //   // console.log('Account Type:', this.accountType);
  //   this.showForm = false;
  //   this.bankdepositeService.addDeposite({
  //     bankId: this.bankId, companyId: this.companyId, branchId: this.branchId, depositAmount: this.depositAmount, depositeType: this.depositeType,
  //     depositId: '0',
  //     chequeNumber: this.chequeNumber
  //   }).subscribe({
  //     next:()=>{
  //       this.getAllBankDeposite()
  //     },error:(err)=>{
  //       console.log(err)
  //     }
  //   })
  




const bankForm = document.getElementById('createNewCategoryPopup');
if (bankForm) {
  
  bankForm.style.display = 'none';
  this.resetForm();
}
}  
cancel_btn(){
  this.resetForm();
  this.showForm = false;
  const bankForm = document.getElementById('createNewCategoryPopup');
  if (bankForm) {
    bankForm.style.display = 'none';
  }
}

deleteDeposite(branchId:number,depositId: number ) {
  
  this.bankdepositeService.deleteDeposite(branchId,depositId).subscribe({
    next: (res) => {
      console.log(res);
      this.toastrService.success("deposite has been deleted" + depositId)
      this.getAllBankDeposite();
    },
    error: (error) => {
      console.log(error);
    },
    complete: () => {
      this.getAllBankDeposite();
    },
  });
}
resetForm() {
  this.objdeposite = new Deposit();
} 


}
