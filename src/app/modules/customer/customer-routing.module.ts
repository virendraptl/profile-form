import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerGuard } from 'src/app/customer.guard';

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
  {
    path: 'auth',
    loadChildren: () =>
      import('../customer/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('../customer/profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [CustomerGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
