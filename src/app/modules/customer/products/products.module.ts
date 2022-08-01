import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { AllProductsComponent } from './all-products/all-products.component';
import { SharedModule } from '../../shared/shared.module';
import { ProdDetailsComponent } from './prod-details/prod-details.component';


@NgModule({
  declarations: [
    AllProductsComponent,
    ProdDetailsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ]
})
export class ProductsModule { }
