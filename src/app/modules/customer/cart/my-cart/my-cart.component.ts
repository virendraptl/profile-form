import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css'],
})
export class MyCartComponent implements OnInit {
  loading: boolean = true;
  cartProducts = [];
  autoHover = [];

  constructor(
    private lstore: LocalStorageService,
    private headerTitleService: HeaderTitleService,
    public previousRouteService: PreviousRouteService,

    private router: Router
  ) {
    this.headerTitleService.setTitle('My Cart');

    this.cartProducts = lstore.getCartData();
    console.table(this.cartProducts);
  }

  ngOnInit(): void {
    this.previousRouteService.setDefPrevUrl('/');
    setTimeout(() => {
      this.loading = false;
    }, 250);
  }

  setCart() {
    this.lstore.setCartData(this.cartProducts);
  }

  toHome() {
    this.router.navigate(['/']);
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
        // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
