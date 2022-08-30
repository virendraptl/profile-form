import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerGuard } from 'src/app/customer.guard';
import { DirectAccessGuard } from 'src/app/direct-access.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { MyCartComponent } from './my-cart/my-cart.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  { path: '', component: MyCartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [CustomerGuard, DirectAccessGuard] },
  {
    path: 'payment/:id',
    component: PaymentComponent,
    canActivate: [CustomerGuard, DirectAccessGuard],
    // canActivate: [CustomerGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
