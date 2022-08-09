import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HeaderTitleService } from '../header-title/header-title.service';
import { SocialStateService } from '../social-state-service/social-state.service';
import { TableDataService } from '../table-data/table-data.service';
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  cartCount = new BehaviorSubject(0);

  constructor(
    private router: Router,
    private table: TableDataService,
    private injector: Injector,
    private authService: SocialAuthService, // private authService: SocialAuthService
    private stateService: SocialStateService
  ) {
    let cartData = JSON.parse(localStorage.getItem('cart-data'));
    let count = 0;
    if (cartData) {
      cartData.forEach((product) => {
        count += product.cartCount;
      });
      this.cartCount.next(count);
    }
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  setCustomerToken(token: string) {
    localStorage.setItem('customer-token', token);
  }

  getCustomerToken() {
    return localStorage.getItem('customer-token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deletetoken() {
    localStorage.removeItem('token');
  }

  setData(name: string, data: any) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  getData(name: string) {
    return JSON.parse(localStorage.getItem(name));
  }

  deleteData(name: string) {
    localStorage.removeItem(name);
  }

  logout() {
    // this.stateService.socialState
    this.authService
      .signOut(true)
      .then(
        (fulfilled) => {
          console.log('signout fulfilled!');
        },
        (rejected) => {
          console.log('signout rejected: ', rejected);
        }
      )
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.deletetoken();
        this.table.setData(1, 10);
        localStorage.removeItem('token');
        const headerTitleService = this.injector.get(HeaderTitleService);
        headerTitleService.userName.next('');
        this.router.navigate(['seller/auth/login']);
      });
    console.log('clicked logout');
  }

  setCartData(data) {
    localStorage.setItem('cart-data', JSON.stringify(data));
    let count = 0;
    data.forEach((product) => {
      count += product.cartCount;
    });
    this.cartCount.next(count);
  }

  getCartData() {
    return JSON.parse(localStorage.getItem('cart-data'));
  }
}
