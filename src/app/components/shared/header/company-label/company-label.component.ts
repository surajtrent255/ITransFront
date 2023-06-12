import { Component } from '@angular/core';
import { CompanyLabelInfoDTO } from 'src/app/models/Company-Label/companyLabel';
import { CompanyLabelService } from 'src/app/service/company-Label-Service/company-label.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-company-label',
  templateUrl: './company-label.component.html',
  styleUrls: ['./company-label.component.css'],
})
export class CompanyLabelComponent {
  companyLabelInfo!: CompanyLabelInfoDTO[];
  label!: CompanyLabelInfoDTO[];
  enableInputField: boolean = false;

  lableId!: number;
  labelText!: string;

  constructor(
    private companyLabelService: CompanyLabelService,
    private LoginService: LoginService
  ) {}

  ngOnInit() {
    this.getLabels();
    this.getCompanyLabel();
  }

  getCompanyLabel() {
    this.companyLabelService
      .getCompanyLabel(this.LoginService.getCompnayId())
      .subscribe((res) => {
        this.companyLabelInfo = res.data;
      });
  }

  getLabels() {
    this.companyLabelService.getLabel().subscribe((res) => {
      this.label = res.data;
    });
  }

  enableInput(e: any) {
    if (e) {
      this.enableInputField = true;
    }
  }

  addLabel() {
    var Input = document.getElementById('label') as HTMLInputElement;
    var labelData = Input.value;

    this.companyLabelService.addLabel(labelData).subscribe({
      next: (res) => {
        this.getLabels();
      },
    });
  }
  cancel() {
    this.enableInputField = false;
  }

  SelectedLabel(e: any, id: number, labelName: string) {
    this.lableId = id;
    this.labelText = labelName;
  }

  Submit() {
    this.companyLabelService
      .addLabelData({
        companyId: this.LoginService.getCompnayId(),
        companyLabelDataId: 0,
        companyLabelId: 0,
        labelId: this.lableId,
        text: this.labelText,
        name: '',
      })
      .subscribe({
        next: (res) => {
          this.getCompanyLabel();
        },
      });
  }

  deleteLabel(id: number) {
    this.companyLabelService.deleteLabel(id).subscribe({
      next: (res) => {
        this.getLabels();
      },
    });
  }
}
