import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import Stepper from 'bs-stepper';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';
import { Store } from '@ngrx/store';
import { getBuyNowData, getCartData } from '../../state/customer.selector';
import { customerState } from '../../state/customer.state';
import { updateCart } from '../../state/customer.actions';

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
  cartProducts = [];
  subTotal: number;
  deliveryFee: number;
  totalAmount: number;
  newAddressForm: FormGroup;
  orderGenerated;
  paymentForm: FormGroup;

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
    private http: HttpService,
    private store: Store<customerState>
  ) {
    this.headerTitleService.setTitle('Checkout');
    let buyNow = lstore.buyNow;
    if (buyNow) {
      // this.cartProducts = [lstore.getBuyNowProduct()];

      store.select(getBuyNowData).subscribe((data) => {
        // this.cartProducts = data ? [...data] : [];
        let temp = JSON.parse(JSON.stringify(data));
        this.cartProducts.push(temp);
        console.log(this.cartProducts);
        this.calcTotal();
      });
    } else {
      // this.cartProducts = lstore.getCartData();
      this.store.select(getCartData).subscribe((data) => {
        // this.cartProducts = data ? [...data] : [];
        let temp = JSON.parse(JSON.stringify(data));
        this.cartProducts = data ? [...temp] : [];
        console.log(this.cartProducts);
        this.calcTotal();
      });
    }
  }

  calcTotal() {
    this.subTotal = 0;

    this.cartProducts.forEach((product) => {
      this.subTotal += product.price * product.cartCount;
    });
    this.deliveryFee = this.subTotal > 999 ? 0 : 100;
    this.totalAmount = this.subTotal + this.deliveryFee;
  }

  ngOnInit(): void {
    // this.getCartData();
    this.createPaymentForm();

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

  getCartData() {
    this.store.select(getCartData).subscribe((data) => {
      // this.cartProducts = data ? [...data] : [];
      let temp = JSON.parse(JSON.stringify(data));
      this.cartProducts = data ? [...temp] : [];
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

  generateOrder() {
    // this.store.dispatch(updateCart({ value: [] }));

    // this.createPaymentForm();
    let shortProductsArr = this.cartProducts.map((product) => {
      let shortProd = {
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: product.cartCount,
        subTotal: product.price * product.cartCount,
      };
      return shortProd;
    });

    // console.log('prods in brief: ', shortProductsArr);
    let shortAddress = {
      street: this.finalAddress.street,
      addressLine2: this.finalAddress.addressLine2,
      city: this.finalAddress.city,
      state: this.finalAddress.state,
      pin: this.finalAddress.pin,
    };

    let order = {
      items: shortProductsArr,
      deliveryFee: this.deliveryFee,
      total: this.totalAmount,
      address: shortAddress,
      // paymentStatus: 'Pending',
      // status: 'Pending',
    };

    this.http.postSecured('shop/orders', order, this.userToken).subscribe({
      next: (data) => {
        this.orderGenerated = data['order'];

        console.log('generated Order:', this.orderGenerated);
        // this.stepCount += 1;
        // this.stepper.next();
        this.router.navigate(['/cart/payment', this.orderGenerated._id]);
        this.store.dispatch(updateCart({ value: [] }));

        // this.toasterService.success(`"Addr`);
      },
      error: (error) => {
        // this.toasterService.error('Error in generating order:', error.message);
        console.error('Error in generating an order:', error.message);
      },
    });
  }

  createPaymentForm() {
    this.paymentForm = this.fb.group({
      nameOnCard: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      expiry: ['', [Validators.required]],
      cvv: ['', [Validators.required]],
    });
  }

  finalPayment() {
    console.log(this.paymentForm.value);
    this.http
      .putSecured(
        `shop/orders/confirm/${this.orderGenerated._id}`,
        this.paymentForm.value,
        this.userToken
      )
      .subscribe({
        next: (data) => {
          this.toasterService.success('Order Placed!');
          console.log(data);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toasterService.error(error.message);
          console.log('error after payment:', error.message);
        },
      });
  }

  next() {
    this.stepCount += 1;
    this.stepper.next();
    // this.generateOrder();
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

//
