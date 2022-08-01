import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductsComponent } from './all-products/all-products.component';
import { ProdDetailsComponent } from './prod-details/prod-details.component';

const routes: Routes = [
  { path: '', component: AllProductsComponent },
  { path: 'details/:id', component: ProdDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
