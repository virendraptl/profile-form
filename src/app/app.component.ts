import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  showHeader: boolean = false;
  url: string;
  btns: string[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader =
          this.activatedRoute.firstChild.snapshot.data['showHeader'] !== false;
      }
    });
  }

  setHeaderBtns() {
    this.url = this.router.url;
    if (this.url.includes('my-profile')) {
      this.btns = ['list', 'products', 'logout'];
    } else if (this.url.includes('products/update')) {
      this.btns = ['back-products', 'logout'];
    } else if (this.url.includes('update')) {
      this.btns = ['back-list', 'profile', 'logout'];
    } else if (this.url.includes('users/details')) {
      this.btns = ['back-list', 'profile', 'logout'];
    } else if (this.url.includes('users/create')) {
      this.btns = ['back-list', 'profile', 'logout'];
    } else if (this.url.includes('products/create')) {
      this.btns = ['back-products', 'profile', 'logout'];
    } else if (
      this.url.includes('users') &&
      !this.url.includes('update') &&
      !this.url.includes('create')
    ) {
      this.btns = ['back-profile', 'new', 'logout'];
    } else if (this.url.includes('products/details')) {
      this.btns = ['back-products', 'logout'];
    } else if (this.url.includes('products')) {
      this.btns = ['back-profile', 'new-product', 'logout'];
    }
  }
}
