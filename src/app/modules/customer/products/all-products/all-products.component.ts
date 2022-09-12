import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';
import { TableDataService } from 'src/app/services/table-data/table-data.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { getCartData } from '../../state/customer.selector';
import { customerState } from '../../state/customer.state';
import { updateCart } from '../../state/customer.actions';

//  function showrandom() {
//    console.log('hiiiiiiii');
//  }

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css'],
})
export class AllProductsComponent implements OnInit {
  productsData;
  allProducts;
  productsArr = [];
  p: number = 1;
  pageData = { page: 1, limit: 10, totalPages: 1, totalResults: 10 };
  loading: boolean = true;
  loadAnimation: boolean = true;
  empty: boolean = false;
  full: boolean = false;
  autoHover = [];
  searchTerm: string = '';
  totalCount:number;

  cartProducts = [];
  searchCopy = [];
  dataCopy: any;
  filteredProd: any[] = [];
  filteredProdIndex: any[];
  allProdCount: number = 15;

  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  constructor(
    private headerTitleService: HeaderTitleService,
    private lstore: LocalStorageService,
    private router: Router,
    private table: TableDataService,
    private http: HttpService,
    public previousRouteService: PreviousRouteService,
    private toasterService: HotToastService,
    private store: Store<customerState>
  ) {
    this.headerTitleService.setTitle('All Products');
  }

  ngOnInit(): void {
    // showrandom();
    this.loading = true;

    this.previousRouteService.setDefPrevUrl('/');
    this.renderProducts(1, 15);

    // this.dataCopy = [...this.productsArr];

    this.cartProducts = this.lstore.getCartData() || [];
    console.log(this.cartProducts);
    // this.searchTerm = this.table.getProdSearchTerm();
    // if (this.searchTerm) {
    //   this.searchResult(this.searchTerm, { key: 'Enter' });
    // }
    this.getCartData();
  }

  getCartData() {
    this.store.select(getCartData).subscribe((data) => {
      // this.cartProducts = data ? [...data] : [];
      let temp = JSON.parse(JSON.stringify(data));
      this.cartProducts = data ? [...temp] : [];
    });
  }

  renderProducts(page, limit) {
    this.http
      .get('shop/products', { page: page, limit: limit })
      .subscribe((data) => {
        this.productsData = data;
        this.allProducts = [...data['results']];
        this.totalCount = data['totalResults'];
        this.createSearchData(this.totalCount)
        console.log('total products: ', this.totalCount);
        this.addItems(this.allProdCount - 15, this.allProdCount);
        // this.dataCopy = [...this.productsArr];
        // 
        
        // 

        if (this.productsArr.length == 0) {
          console.log('no products to show;');
          this.empty = true;
        }
        // console.log('ProductsArr data:', this.productsArr);
        this.loading = false;
      });
  }

  createSearchData(count:number){
    this.http
      .get('shop/products', { page: 1, limit: count })
      .subscribe((data) => {
        this.productsData = data;
        this.dataCopy = [...data['results']];
        console.log('searchcopy generated!!!!!!!!!!');
        this.searchTerm = this.table.getProdSearchTerm();
        if (this.searchTerm) {
          this.searchResult(this.searchTerm, { key: 'Enter' });
        }
      });
  }

  addItems(startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; ++i) {
      if (this.productsArr.length < this.productsData.totalResults) {
        this.productsArr.push(this.allProducts[i]);
      }
    }
    this.productsArr.length == this.productsData.totalResults
      ? (this.full = true)
      : null;
    setTimeout(() => {
      this.loading = false;
      this.loadAnimation = false;
    }, 1000);
  }

 

  onScrollDown(ev) {
    this.loadAnimation = true;
    // console.log('scrolled down!!', ev);

    const start = this.allProdCount;
    this.allProdCount += 15;
    // this.addItems(start, this.allProdCount);

    this.renderProducts(1, this.allProdCount);
    // this.direction = 'down';
  }

  pageChanged(event) {
    console.log(event);
    // this.renderProducts(event, this.totalData.limit);
  }

  addToCart(product) {
    // this.cartProducts = this.lstore.getCartData() || [];
    let isPresent = false;

    this.cartProducts.forEach((prod) => {
      if (prod._id == product._id) {
        isPresent = true;
        prod.cartCount++;
      }
    });

    if (!isPresent) {
      product.cartCount = 1;
      this.cartProducts.push(product);
    }

    // this.lstore.setCartData(this.cartProducts);
    this.store.dispatch(updateCart({ value: this.cartProducts }));

    this.toasterService.success(`"${product.name}" added to the cart!`);
  }

  searchProduct(event) {
    this.searchTerm = event.target.value;
    console.log('searchTerm: ', this.searchTerm);
    this.table.setProdSearchTerm(this.searchTerm);
    this.searchResult(this.searchTerm, event);
  }

  searchResult(term: string, event) {
    this.productsArr = [...this.dataCopy];
    if (term && term !== '') {
      this.filterReset();
      this.dataCopy.forEach((user, index) => {
        if (user.name.toLowerCase().search(term) != -1) {
          this.filteredProd.push(user);
          this.filteredProdIndex.push(
            // index + 1 + (this.productsArr.length - 1) * this.pageSize
            index + 1 + (this.productsArr.length - 1) * 10
          );
        }
      });
      // this.productsArr = [...this.dataCopy];
      if (event.key == 'Enter' || event.type == 'click') {
        this.productsArr = [...this.filteredProd];
        this.filteredProd = [];
      }
    } else if (term == '' && (event.key == 'Enter' || event.type == 'click')) {
      this.productsArr = [...this.dataCopy];
    } else {
      this.filterReset();
    }
  }

  filterReset() {
    // this.productsArr = [...this.dataCopy];
    this.filteredProd = [];
    this.filteredProdIndex = [];
  }

  goToProduct(id) {
    this.router.navigate(['/details', id]);
  }

  searchClick(event) {
    console.log(event);
  }

  isPresent(product) {
    let isPresent = false;

    this.cartProducts.forEach((prod) => {
      if (prod._id == product._id) {
        isPresent = true;
      }
    });

    return isPresent;
  }
}
