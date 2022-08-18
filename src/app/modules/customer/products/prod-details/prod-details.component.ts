import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';

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

  constructor(
    private http: HttpService,
    private activatedRoute: ActivatedRoute,
    private lstore: LocalStorageService,
    private toasterService: HotToastService,
    private headerTitleService: HeaderTitleService,
    public previousRouteService: PreviousRouteService,

    private router: Router
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
      },
      error: (err) => {
        console.log('Error: ', err);
      },
    });
  }

  checkCartCount(id) {
    this.cartProducts = this.lstore.getCartData();
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
    this.lstore.setBuyNowProduct(this.productData);
    this.router.navigate(['/cart/checkout']);
  }

  addToCart() {
    this.cartProducts = this.lstore.getCartData() || [];
    let isPresent = false;

    this.cartProducts.forEach((prod) => {
      if (prod._id == this.productData._id) {
        isPresent = true;
        prod.cartCount++;
      }
    });

    if (!isPresent) {
      this.productData.cartCount = 1;
      this.cartProducts.push(this.productData);
    }
    this.cartCount++;
    this.cartText = 'Added to Cart';

    this.lstore.setCartData(this.cartProducts);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
