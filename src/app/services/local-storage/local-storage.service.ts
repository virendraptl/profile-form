import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HeaderTitleService } from '../header-title/header-title.service';
import { SocialStateService } from '../social-state-service/social-state.service';
import { TableDataService } from '../table-data/table-data.service';
import { Store } from '@ngrx/store';
import { getCartData } from 'src/app/modules/customer/state/customer.selector';
import { updateCart } from 'src/app/modules/customer/state/customer.actions';
import { customerState } from 'src/app/modules/customer/state/customer.state';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  cartCount = new BehaviorSubject(0);
  buyNow: boolean = false;
  cartProducts;

  constructor(
    private router: Router,
    private table: TableDataService,
    private injector: Injector,
    private store: Store<customerState>,
    private authService: SocialAuthService // private authService: SocialAuthService
  ) {
    this.store.select(getCartData).subscribe((data) => {
      // this.cartProducts = data ? [...data] : [];
      let temp = JSON.parse(JSON.stringify(data));
      this.cartProducts = data ? [...temp] : [];
      // let cartData = JSON.parse(localStorage.getItem('cart-data'));
      let count = 0;
      if (this.cartProducts) {
        this.cartProducts.forEach((product) => {
          count += product.cartCount;
        });
        this.cartCount.next(count);
      }
    });
  }

  // getCartData() {
  //   this.store.select(getCartData).subscribe((data) => {
  //     // this.cartProducts = data ? [...data] : [];
  //     let temp = JSON.parse(JSON.stringify(data));
  //     this.cartProducts = data ? [...temp] : [];
  //   });
  // }

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

  deleteCustomerToken() {
    localStorage.removeItem('customer-token');
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

  customerLogOut() {
    this.deleteCustomerToken();
    const headerTitleService = this.injector.get(HeaderTitleService);
    headerTitleService.customerName.next('');
    // this.headerTitleService.customerName.next('');
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

  setBuyNowProduct(data) {
    localStorage.setItem('buyNow-data', JSON.stringify(data));
  }

  getBuyNowProduct() {
    return JSON.parse(localStorage.getItem('buyNow-data'));
  }

  buyNowOn() {
    this.buyNow = true;
  }

  buyNowOff() {
    this.buyNow = false;
  }
}
