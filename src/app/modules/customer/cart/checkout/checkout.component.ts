import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Stepper from 'bs-stepper';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  stepper: Stepper;
  isLoggedIn: boolean = false;
  currentData: any;
  addressList: any;
  userToken: string;
  isLoading1: boolean = true;
  stepCount: number = 1;
  finalAddress: any;
  cartProducts;
  subTotal: number;

  constructor(
    private headerTitleService: HeaderTitleService,
    public previousRouteService: PreviousRouteService,
    private lstore: LocalStorageService,
    private router: Router,
    private http: HttpService
  ) {
    this.headerTitleService.setTitle('Checkout');
    this.cartProducts = lstore.getCartData();
    console.log(this.cartProducts);
    this.calcTotal();
  }

  calcTotal() {
    this.subTotal = 0;
    this.cartProducts.forEach((product) => {
      this.subTotal += product.price * product.cartCount;
    });
  }

  ngOnInit(): void {
    this.previousRouteService.setDefPrevUrl('/cart');
    this.userToken = this.lstore.getCustomerToken();
    if (this.userToken) {
      this.getProfileData(this.userToken);
    } else {
      this.isLoading1 = false;
    }

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: true,
      animation: true,
    });
  }

  getProfileData(token) {
    this.http.getSecured('shop/auth/self', token).subscribe({
      next: (data) => {
        this.currentData = data;
        this.isLoggedIn = true;
        this.isLoading1 = false;
        console.log(this.currentData);
        this.headerTitleService.getCustomerData();
        this.getAddresses();
      },
      error: (error) => {
        console.log(error);
        // this.location.back();
      },
    });
  }

  getAddresses() {
    this.http.getSecured('customers/address', this.userToken).subscribe({
      next: (data) => {
        this.addressList = data;
        console.log(this.addressList);
      },
      error: (error) => {
        console.error('Error in fetching address list:', error.message);
      },
    });
  }

  next() {
    this.stepCount += 1;
    this.stepper.next();
  }

  previous() {
    this.stepCount -= 1;
    this.stepper.previous();
  }

  toLoginPage() {
    this.lstore.customerLogOut();
    this.router.navigate(['/auth']);
  }

  radioOp() {
    console.log(this.finalAddress);
  }
}

// stepper form:- https://github.com/Johann-S/bs-stepper