import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Store } from '@ngrx/store';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';
import { getCartData } from '../../state/customer.selector';
import { customerState } from '../../state/customer.state';
import { setBuyNowProduct, updateCart } from '../../state/customer.actions';

@Component({
  selector: 'app-prod-details',
  templateUrl: './prod-details.component.html',
  styleUrls: ['./prod-details.component.css'],
})
export class ProdDetailsComponent implements OnInit {
  loading: boolean;
  productId: string;
  productData: any;
  productImages: any;
  fullviewArr = [];
  showFlag: boolean = false;
  selectedImageIndex: number = -1;

  previewUrl = '';
  uploadDate;
  updateDate;

  cartText: string = 'Add To Cart';
  cartCount: number = 0;
  cartProducts;

  isSubmitted: boolean = false;
  isUpdated: boolean = false;
  isPresent: boolean = false;

  constructor(
    private http: HttpService,
    private activatedRoute: ActivatedRoute,
    private lstore: LocalStorageService,
    private toasterService: HotToastService,
    private headerTitleService: HeaderTitleService,
    public previousRouteService: PreviousRouteService,

    private router: Router,
    private store: Store<customerState>
  ) {
    this.headerTitleService.setTitle('Products Details');
  }

  ngOnInit(): void {
    this.loading = true;
    this.previousRouteService.setDefPrevUrl('/');

    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.http.get(`shop/products/${this.productId}`).subscribe({
      next: (data) => {
        this.loading = false;
        this.productData = data;
        this.productImages = data['images'];
        this.productImages.forEach((img) => {
          this.fullviewArr.push({ image: img.url });
        });
        this.previewUrl = this.productImages[0].url;
        this.uploadDate = new Date(this.productData.createdAt);
        this.updateDate = new Date(this.productData.updatedAt);
        console.log('Product details:', this.productData);
        console.log('Product images:', this.productImages);
        this.checkCartCount(this.productData._id);
        this.getCartData();
        this.checkCartStatus();
      },
      error: (err) => {
        console.log('Error: ', err);
      },
    });
  }

  getCartData() {
    this.store.select(getCartData).subscribe((data) => {
      // this.cartProducts = data ? [...data] : [];
      let temp = JSON.parse(JSON.stringify(data));
      this.cartProducts = data ? [...temp] : [];
    });
  }

  checkCartCount(id) {
    // this.cartProducts = this.lstore.getCartData();
    if (this.cartProducts) {
      this.cartProducts.forEach((product) => {
        if (product._id == id) {
          this.productData = product;
          this.cartCount = product.count;
          this.cartText = 'Added to Cart';
        }
      });
    } else this.cartProducts = [];
  }

  imgClicked(i) {
    this.selectedImageIndex = i;
    this.previewUrl = this.productImages[i].url;
    // console.log('img clicked............');
  }

  openFullScreenView(previewUrl) {
    // this.selectedImageIndex = this.fullviewArr.indexOf(previewUrl);
    this.showFlag = true;
  }

  closeFullScreenView() {
    this.showFlag = false;
    this.selectedImageIndex = -1;
  }

  buyNow() {
    this.lstore.buyNowOn();
    this.productData.cartCount = 1;
    // this.lstore.setBuyNowProduct(this.productData);
    this.store.dispatch(setBuyNowProduct({ value: this.productData }));

    this.router.navigate(['/cart/checkout']);
  }

  checkCartStatus() {
    this.cartProducts.forEach((prod) => {
      if (prod._id == this.productData._id) {
        this.isPresent = true;
        // prod.cartCount++;
      }
    });

    return this.isPresent;
  }

  addToCart() {
    console.log('Cart data before adding:', this.cartProducts);
    // this.cartProducts = this.lstore.getCartData() || [];
    // let isPresent = false;

    // this.cartProducts.forEach((prod) => {
    //   if (prod._id == this.productData._id) {
    //     isPresent = true;
    //     prod.cartCount++;
    //   }
    // });

    // if (!this.isPresent) {
    //   this.productData.cartCount = 1;
    //   this.cartProducts.push(this.productData);
    // }
    // this.cartCount++;
    // this.cartText = 'Added to Cart';
    // this.checkCartStatus() ? 

    // this.lstore.setCartData(this.cartProducts);
    this.store.dispatch(updateCart({ value: this.cartProducts }));
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
