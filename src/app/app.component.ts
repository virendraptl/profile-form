import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { first, take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  showHeader: boolean = false;
  showAvatar: boolean = true;
  url: string;
  btns: string[];
  title = 'auth-practice';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //   this.activatedRoute.data.subscribe((data) => {
    //     console.log('Header present: ', data);
    //   });
    //     this.showHeader =
    //       this.activatedRoute.firstChild.snapshot.data['header'] !== false;
    //   }
    // });
    // this.activatedRoute.data.pipe(take(1)).subscribe((data)=>{
    //   console.log('data from acti route: ', data);
    // })
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
      this.btns = ['back-profile', 'new', 'products', 'logout'];
    } else if (this.url.includes('products/details')) {
      this.btns = ['back-products', 'logout'];
    } else if (this.url.includes('products')) {
      this.btns = ['back-profile', 'new-product', 'list', 'logout'];
    }

    if (
      this.url.includes('/seller/auth/login') ||
      this.url.includes('/seller/auth/register') ||
      this.url.includes('/seller/auth/reset-password') ||
      this.url.includes('/seller/verify-email')
    ) {
      this.showHeader = false;
    } else {
      this.showHeader = true;
    }

    if (this.url.includes('seller')) {
      this.showAvatar = true;
    } else {
      this.showAvatar = false;
    }
  }
}
