import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
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
  newAddressForm: FormGroup;

  editOn: boolean = false;
  editFormNo: number;
  editAddId: string;
  emptyAddrForm = {
    street: '',
    addressLine2: '',
    city: '',
    state: '',
    pin: '',
  };

  constructor(
    private headerTitleService: HeaderTitleService,
    public previousRouteService: PreviousRouteService,
    private lstore: LocalStorageService,
    private fb: FormBuilder,
    private router: Router,
    private toasterService: HotToastService,
    private http: HttpService
  ) {
    this.headerTitleService.setTitle('Checkout');
    let buyNow = lstore.buyNow;
    if(buyNow){
      this.cartProducts = [lstore.getBuyNowProduct()];
    }else{
      this.cartProducts = lstore.getCartData();
    }
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
    this.createNewAdrForm(this.emptyAddrForm);
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

  editAddress(i: number, id) {
    this.editFormNo = i;
    this.editAddId = id;
    this.editOn = true;
    this.createNewAdrForm(this.addressList[i]);
  }

  emptyAddress() {
    this.editOn = false;
    this.createNewAdrForm(this.emptyAddrForm);
  }

  createNewAdrForm(address) {
    this.newAddressForm = this.fb.group({
      street: [address.street, [Validators.required]],
      addressLine2: [address.addressLine2, [Validators.required]],
      city: [address.city, [Validators.required]],
      state: [address.state, [Validators.required]],
      pin: [address.pin, [Validators.required]],
    });
  }

  submitAddrForm() {
    if (!this.editOn) {
      console.log('new address:', this.newAddressForm.value);
      this.http
        .postSecured(
          'customers/address',
          this.newAddressForm.value,
          this.userToken
        )
        .subscribe({
          next: (data) => {
            this.toasterService.success(`"Address list updated!`);

            this.getAddresses();
          },
          error: (error) => {
            console.error('Error in fetching address list:', error.message);
          },
        });
    } else {
      this.editOn = false;
      console.log(
        'updated address at',
        this.editFormNo,
        this.newAddressForm.value
      );
      this.http
        .putSecured(
          `customers/address/${this.editAddId}`,
          this.newAddressForm.value,
          this.userToken
        )
        .subscribe({
          next: (data) => {
            this.toasterService.success(`"Address list updated!`);

            this.getAddresses();
          },
          error: (error) => {
            console.error('Error in fetching address list:', error.message);
          },
        });
    }
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

  get regAdStreet() {
    return this.newAddressForm.get('street');
  }
  get regAdLine2() {
    return this.newAddressForm.get('addressLine2');
  }
  get regAdCity() {
    return this.newAddressForm.get('city');
  }
  get regAdState() {
    return this.newAddressForm.get('state');
  }
  get regAdPin() {
    return this.newAddressForm.get('pin');
  }
}

// stepper form:- https://github.com/Johann-S/bs-stepper
