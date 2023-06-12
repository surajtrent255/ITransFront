import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Logo } from 'src/app/models/company-logo/CompanyImage';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
})
export class DemoComponent {
  imageData!: Logo;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private LoginSerice: LoginService
  ) {}

  englishDate!: string;
  nepaliDate!: string;

  ngOnInit() {}

  convertDate() {
    const [year, month, day] = this.englishDate.split('-').map(Number);
    const nepaliDate = this.getNepaliDate(year, month, day);
    this.nepaliDate = nepaliDate;
  }

  getNepaliDate(year: number, month: number, day: number): string {
    const nepaliEraOffset = 56;
    const nepaliMonthDays = [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 29, 30];

    const totalEnglishDays = Math.floor(
      (year - 1943) * 365 +
        Math.floor((year - 1943) / 4) -
        Math.floor((year - 1943) / 100) +
        Math.floor((year - 1943) / 400) +
        this.getDayCountUntilMonth(year, month) +
        day
    );

    let totalNepaliDays = totalEnglishDays - nepaliEraOffset;

    let bsYear = 2000;
    let bsMonth = 9;
    let bsDay = 17;

    while (totalNepaliDays > 0) {
      const daysInMonth = nepaliMonthDays[bsMonth - 1];
      if (bsDay > daysInMonth) {
        bsMonth++;
        bsDay = 1;
        if (bsMonth > 12) {
          bsYear++;
          bsMonth = 1;
        }
      }
      totalNepaliDays--;
      bsDay++;
    }

    return `${bsYear}-${this.formatNumber(bsMonth)}-${this.formatNumber(
      bsDay
    )}`;
  }

  private getDayCountUntilMonth(year: number, month: number): number {
    const daysUntilMonth = [
      0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334,
    ];
    const leapDaysUntilMonth = [
      0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335,
    ];
    return year % 4 === 0
      ? leapDaysUntilMonth[month - 1]
      : daysUntilMonth[month - 1];
  }

  private formatNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
}
