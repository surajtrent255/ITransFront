import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Company } from 'src/app/models/company';
import { LoginService } from 'src/app/service/shared/login.service';
declare const bootstrap: any;

@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: [
    './hierarchy.component.css',
    '../../../../assets/resources/css/styles.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HierarchyComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  companyName!: string;

  ngOnInit(): void {
    const data = localStorage.getItem('companyDetails');
    const parsedData = JSON.parse(data || '{}');
    const { name } = parsedData;
    this.companyName = name;

    document.querySelectorAll('.sidebar .nav-link').forEach(function (element) {
      element.addEventListener('click', function (e) {
        let nextEl = element.nextElementSibling;
        let parentEl = element.parentElement;

        if (nextEl) {
          e.preventDefault();
          let mycollapse = new bootstrap.Collapse(nextEl);

          if (nextEl.classList.contains('show')) {
            mycollapse.hide();
          } else {
            mycollapse.show();
          }
        }
      });
    });
  }
}
