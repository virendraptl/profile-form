import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { CreateComponent } from './create/create.component';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AvatarModule } from 'ngx-avatar';
import { MatIconModule } from '@angular/material/icon';
import { UpdateComponent } from './update/update.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    CreateComponent,
    UpdateComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    AvatarModule,
    MatIconModule,
    MatSnackBarModule,
    MatMenuModule,
  ],
})
export class UsersModule {}
