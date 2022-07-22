import { Component, OnInit } from '@angular/core';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  public productsArr;

  constructor(
    private headerTitleService: HeaderTitleService,
    private http: HttpService
  ) {
    this.headerTitleService.setTitle('Products List');
  }

  ngOnInit(): void {
    this.renderProducts();
  }

  renderProducts(){
    this.http.get('products').subscribe(data => {
      this.productsArr = [...data['results']]
      console.log('Products data:', this.productsArr);
    })
  }

  getDetails(i){
    console.log(this.productsArr[i]);
  }
}
