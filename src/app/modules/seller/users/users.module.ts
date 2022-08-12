import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { SharedModule } from '../../shared/shared.module';
import { MatStepperModule } from '@angular/material/stepper';


@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    CreateComponent,
    UpdateComponent,
  ],
  imports: [CommonModule, UsersRoutingModule, MatStepperModule, SharedModule],
})
export class UsersModule {}
