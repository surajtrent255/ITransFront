import { Component, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FixedAssets } from 'src/app/models/Fixed Assets/FixedAssets';
import { FixedAssetsService } from 'src/app/service/shared/Assets And Expenses/fixed-assets.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-fixed-asstets',
  templateUrl: './fixed-asstets.component.html',
  styleUrls: ['./fixed-asstets.component.css'],
})
export class FixedAsstetsComponent {
  AssetIdForEdit!: number;
  fixedAssets!: FixedAssets[];
  LoggedInCompanyId!: number;
  LoggedInBranchId!: number;

  IsAuditor!: boolean;
  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  FixedAssetForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    billNo: new FormControl('', [Validators.required]),
    cash: new FormControl('', [Validators.required]),
    loan: new FormControl('', [Validators.required]),
    loanId: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
  });

  constructor(
    private fixedAssetService: FixedAssetsService,
    private LoginService: LoginService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.LoggedInCompanyId = this.LoginService.getCompnayId();
    this.LoggedInBranchId = this.LoginService.getBranchId();

    this.getFixedAssetsDetails();

    let roles = localStorage.getItem('CompanyRoles');
    if (roles?.includes('AUDITOR')) {
      this.IsAuditor = false;
    } else {
      this.IsAuditor = true;
    }

    const popupElement =
      this.elementRef.nativeElement.querySelector('#createAssetsPopup');
    this.commonService.dragablePopUp(popupElement);
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = this.addZeroPadding(date.getMonth() + 1);
    const day = this.addZeroPadding(date.getDate());
    return `${year}-${month}-${day}`;
  }

  addZeroPadding(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedFixedAssets();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedFixedAssets();
    }
  }

  fetchLimitedFixedAssets() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.fixedAssetService
      .getLimitedFixedAssets(
        offset,
        this.pageTotalItems,
        this.LoggedInCompanyId,
        this.LoggedInBranchId
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.toastrService.error('assets not found ');
          this.currentPageNumber -= 1;
        } else {
          this.fixedAssets = res.data;
        }
      });
  }

  getFixedAssetsDetails() {
    this.fixedAssetService
      .getFixedAssetsDetails(this.LoggedInCompanyId)
      .subscribe((res) => {
        this.fixedAssets = res.data;
      });
  }

  SubmitFixedAssetForm() {
    this.fixedAssetService
      .addFixedAssetDetails({
        sn: 0,
        companyId: this.LoggedInCompanyId,
        branchId: this.LoggedInBranchId,
        amount: Number(this.FixedAssetForm.value.amount!),
        billNo: Number(this.FixedAssetForm.value.billNo!),
        cash: Number(this.FixedAssetForm.value.cash!),
        date: this.FixedAssetForm.value.date!,
        loan: this.FixedAssetForm.value.loan!,
        loanId: Number(this.FixedAssetForm.value.loanId!),
        name: this.FixedAssetForm.value.name!,
        status: true,
      })
      .subscribe({
        complete: () => {
          this.getFixedAssetsDetails();
        },
        next: (res) => {
          this.FixedAssetForm.reset();
        },
      });
  }

  deleteFixedAssetsDetails(sn: number) {
    this.fixedAssetService.deleteFixedDetails(sn).subscribe({
      complete: () => {
        this.getFixedAssetsDetails();
      },
    });
  }
  editFixedAsset(SN: number) {
    this.AssetIdForEdit = SN;
  }

  getAssetsDetails() {
    this.getFixedAssetsDetails();
  }
}
