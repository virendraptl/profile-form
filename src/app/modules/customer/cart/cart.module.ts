import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { MyCartComponent } from './my-cart/my-cart.component';
import { SharedModule } from '../../shared/shared.module';
import { CheckoutComponent } from './checkout/checkout.component';


@NgModule({
  declarations: [
    MyCartComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    SharedModule
  ]
})
export class CartModule { }
