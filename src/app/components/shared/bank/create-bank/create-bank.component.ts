import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountType } from 'src/app/models/AccountTypes';
import { Bank } from 'src/app/models/Bank';
import { BankList } from 'src/app/models/BankList';
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

  showInput!:boolean;

  Bank: Bank[] = [];
  accountTypes: AccountType[] = [];
  showForm!: boolean;
  localStorageCompanyId!: number;
  UserbranchId!: number;

  bankList: BankList[] = [];

  bankObj: Bank = new Bank


  constructor(private bankService: BankService, private toastrService: ToastrService, private loginService: LoginService) { }

  ngOnInit() {

    this.localStorageCompanyId = this.loginService.getCompnayId()

    this.UserbranchId = this.loginService.getBranchId()
    this.companyId = this.loginService.getCompnayId()
    this.branchId = this.loginService.getBranchId()
    this.getAllBank();
    this.getBankList();
    this.getAllAccountTypes();



  }

  getBankList() {
    this.bankService.getBankList().subscribe(data => {
      this.bankList = data.data;
    })
  }

  getAllBank() {
    this.bankService.getAllBanks(this.companyId, this.branchId).subscribe(res => {
      console.log(res.data)
      this.Bank = res.data;
    });

  }

<<<<<<< HEAD

=======
  getAllBankNames() {

  }
>>>>>>> f26f8e16471ce7485f4e68c99941e0ca122e8de4

  getAllAccountTypes() {
    this.bankService.getAccountTypes().subscribe((data) => {
      this.accountTypes = data.data
    })
  }

  openForm() {
    console.log('Opening form...');
    // Reset form data
    this.companyId = this.localStorageCompanyId;
    this.branchId = this.UserbranchId;
    // this.bankName = '';
    // this.accountNumber = '';
    // this.initialAmount = '';
    // this.accountType = '';
    this.showForm = true;
    

    // Show form

    const bankForm = document.getElementById('bankForm');
    if (bankForm) {
<<<<<<< HEAD
      
      bankForm.style.display = 'block';
      this.showForm = false;
    }
  }

  SelecetBankChange(bankName:string){
    
  if(bankName === 'other'){
    console.log("other")
    this.showInput = true
  }else{
    console.log(bankName)
    this.showInput = false
  }
=======
      bankForm.style.display = 'block';
    }
>>>>>>> f26f8e16471ce7485f4e68c99941e0ca122e8de4
  }

  createBank(form: any) {
    this.showForm = false;
    this.bankObj.companyId = this.companyId;
    this.bankObj.branchId = this.branchId;
    this.bankService.addBank(this.bankObj).subscribe({
      next: (data) => {
        this.toastrService.success("bank is successfully added with id " + data.data)
        this.getAllBank();
<<<<<<< HEAD
        
      }, error: (err) => {
        this.toastrService.error("something went wrong")
      }
     
    }
    )
    

   form.reset(this.showForm);

    // Hide form
    const bankForm = document.getElementById('createNewCategoryPopup');
=======

      }, error: (err) => {
        this.toastrService.error("something went wrong")
      }
    })



    // Hide form
    const bankForm = document.getElementById('bankForm');
>>>>>>> f26f8e16471ce7485f4e68c99941e0ca122e8de4
    if (bankForm) {
      bankForm.style.display = 'none';
    }
  }
  cancel_btn() {
    this.showForm = false;
    const bankForm = document.getElementById('createNewCategoryPopup');
    
    if (bankForm) {
      bankForm.style.display = 'none';
    }
  }

  deleteBank(accountNumber: number) {
  
    this.bankService.deletebank(accountNumber).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success("bank has been deleted")
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.getAllBank();
      },
    });
  }

}
