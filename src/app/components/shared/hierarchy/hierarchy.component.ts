import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  ngOnInit(): void {
    // Initialize Bootstrap collapse
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
