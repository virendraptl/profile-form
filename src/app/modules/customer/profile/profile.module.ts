import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { SharedModule } from '../../shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';



@NgModule({
  declarations: [CustomerProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    ImageCropperModule,
  ],
})
export class ProfileModule {}
