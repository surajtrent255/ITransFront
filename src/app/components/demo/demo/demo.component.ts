import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
})
export class DemoComponent {
  constructor(private router: Router) {}

  gotoPayment() {
    this.router.navigateByUrl('/dashboard/payment');
  }
}
