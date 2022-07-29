import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/customer/customer.module').then(
        (m) => m.CustomerModule
      ),
  },
  {
    path: 'seller',
    loadChildren: () =>
      import('./modules/seller/seller.module').then((m) => m.SellerModule),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

// {
//   path: '',
//   loadChildren: () =>
//     import('./modules/seller/auth/auth.module').then((m) => m.AuthModule),
//   data: { showHeader: false },
// },
// {
//   path: 'user',
//   loadChildren: () =>
//     import('./modules/seller/user/user.module').then((m) => m.UserModule),
// },
// {
//   path: 'users',
//   loadChildren: () =>
//     import('./modules/seller/users/users.module').then((m) => m.UsersModule),
//   canActivate: [AuthGuard],
// },
// {
//   path: 'products',
//   loadChildren: () =>
//     import('./modules/seller/products/products.module').then(
//       (m) => m.ProductsModule
//     ),
//   canActivate: [AuthGuard],
// },
// { path: '**', redirectTo: '' },
