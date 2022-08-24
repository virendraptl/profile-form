import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { getCartData } from '../../state/customer.selector';
import { customerState } from '../../state/customer.state';
import { updateCart } from '../../state/customer.actions';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css'],
})
export class MyCartComponent implements OnInit {
  loading: boolean = true;
  cartProducts = [];
  autoHover = [];
  subTotal: number;

  constructor(
    private lstore: LocalStorageService,
    private headerTitleService: HeaderTitleService,
    public previousRouteService: PreviousRouteService,
    private store: Store<customerState>,
    private router: Router
  ) {
    this.headerTitleService.setTitle('My Cart');
    this.getCartData();

    // this.cartProducts = lstore.getCartData() || [];
    // console.table(this.cartProducts);
  }

  calcTotal() {
    this.subTotal = 0;
    this.cartProducts.forEach((product) => {
      this.subTotal += product.price * product.cartCount;
    });
  }

  ngOnInit(): void {

    this.previousRouteService.setDefPrevUrl('/');
    setTimeout(() => {
      this.loading = false;
    }, 250);
  }

  getCartData() {
    this.store.select(getCartData).subscribe((data) => {
      // this.cartProducts = data ? [...data] : [];
      let temp = JSON.parse(JSON.stringify(data));
      this.cartProducts = data ? [...temp] : [];
      this.calcTotal();
    });
  }

  setCart() {
    // this.lstore.setCartData(this.cartProducts);
    this.store.dispatch(updateCart({ value: this.cartProducts }));
  }

  toHome() {
    this.router.navigate(['/']);
  }

  toCheckout() {
    this.router.navigate(['/cart/checkout']);
  }

  sweetDelete(i) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove from cart!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartProducts.splice(i, 1);
        this.setCart();
        this.calcTotal();
        // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
