import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartModule } from './cart/cart.module';
CartModule;

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../customer/products/products.module').then(
        (m) => m.ProductsModule
      ),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('../customer/cart/cart.module').then((m) => m.CartModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
