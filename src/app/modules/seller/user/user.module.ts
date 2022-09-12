import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { RecaptchaV3Module } from 'ng-recaptcha';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule, RecaptchaV3Module],
})
export class UserModule {}
