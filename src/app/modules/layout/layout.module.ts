import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [HeaderComponent, ConfirmationDialogComponent],
  imports: [CommonModule, SharedModule],
  exports: [HeaderComponent],
})
export class LayoutModule {}
