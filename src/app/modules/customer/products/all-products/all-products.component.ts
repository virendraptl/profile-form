import { Component, OnInit } from '@angular/core';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css'],
})
export class AllProductsComponent implements OnInit {
  constructor(private headerTitleService: HeaderTitleService) {
    this.headerTitleService.setTitle('All Products');
  }

  ngOnInit(): void {}
}
