import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NgxCarouselModule } from 'ngx-light-carousel';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { SharedModule } from '../../shared/shared.module';
import { FileDragDropDirective } from 'src/app/directives/file-drag-drop.directive';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { NgDompurifyModule } from '@tinkoff/ng-dompurify';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailsComponent,
    ProductCreateComponent,
    ProductUpdateComponent,
    FileDragDropDirective,
  ],
  imports: [CommonModule, ProductsRoutingModule, SharedModule, NgDompurifyModule, QuillModule.forRoot()],
})
export class ProductsModule {}
