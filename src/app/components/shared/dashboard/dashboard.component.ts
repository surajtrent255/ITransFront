import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Company } from 'src/app/models/company';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css',
    '../../../../assets/resources/css/styles.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {}
}
