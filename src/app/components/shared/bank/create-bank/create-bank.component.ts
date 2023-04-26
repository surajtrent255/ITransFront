import { Component } from '@angular/core';
import { Bank } from 'src/app/models/Bank';
import { Branch } from 'src/app/models/Branch';
import { User } from 'src/app/models/user';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { LoginService } from 'src/app/service/shared/login.service';


@Component({
  selector: 'app-create-bank',
  templateUrl: './create-bank.component.html',
  styleUrls: ['./create-bank.component.css']
})
export class CreateBankComponent {
  companyId!: number 
  branchId!: number 
  bankName!: string 
  accountNumber!: string;
  initialAmount!: string;
  accountType!: string;

  Bank: Bank[] = [];
  showForm!: boolean;
  localStorageCompanyId!:number;
  UserbranchId!: number;
 

  constructor(private bankService: BankService,private loginService:LoginService) { }

  ngOnInit() {
    
    // const data = localStorage.getItem('companyDetails');
    // const parsedData = JSON.parse(data || '{}');
    // const { companyId } = parsedData;
    // this.localStorageCompanyId = companyId;

   this.localStorageCompanyId =this.loginService.getCompnayId()

    this.UserbranchId = this.loginService.getBranchId()
    this.companyId =this.loginService.getCompnayId()
    this.branchId =this.loginService.getBranchId()
    this.getAllBank();
  
   
  

  }

  getAllBank(){
    this.bankService.getAllBanks(this.companyId,this.branchId).subscribe(res => {
      console.log(res.data)
      this.Bank = res.data;
    });

  }

  openForm() {
    console.log('Opening form...');
    // Reset form data
    this.companyId = this.localStorageCompanyId;
    this.branchId = this.UserbranchId;
    this.bankName = '';
    this.accountNumber = '';
    this.initialAmount = '';
    this.accountType = '';
    this.showForm = true;

    // Show form
   
    const bankForm = document.getElementById('bankForm');
  if (bankForm) {
    bankForm.style.display = 'block';
  }
  }

  submitForm() {
    if (this.bankName.trim() === '' || this.accountNumber.trim() === '' || this.initialAmount.trim() === '' || this.accountType.trim() === '') {
      alert('Please fill in all fields');
      return;
    }
  
    // Replace this with the code that handles the form data
    // console.log('Company ID:', this.companyId);
    // console.log('Branch ID:', this.branchId);
    // console.log('Bank Name:', this.bankName);
    // console.log('Account Number:', this.accountNumber);
    // console.log('Initial Amount:', this.initialAmount);
    // console.log('Account Type:', this.accountType);
    this.showForm = false;
    this.bankService.addBank({id:0,companyId:this.companyId,branchId:this.branchId,bankName:this.bankName,accountNumber:this.accountNumber,initialAmount:this.initialAmount,accountType:this.accountType}).subscribe({
      next:()=>{
        this.getAllBank()
      },error:(err)=>{
        console.log(err)
      }
    })
  
  

    // Hide form
  const bankForm = document.getElementById('bankForm');
  if (bankForm) {
    bankForm.style.display = 'none';
  }
  }
  cancel_btn(){
    this.showForm = false;
    const bankForm = document.getElementById('bankForm');
    if (bankForm) {
      bankForm.style.display = 'none';
    }
  }
}
