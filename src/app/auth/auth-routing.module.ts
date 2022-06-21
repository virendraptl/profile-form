import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';



const routes: Routes = [
  {
    path:"",
    children:[
      { path: '', redirectTo: 'login', pathMatch: 'full'},
      { path:'register', component: RegisterComponent},
      { path:'login', component: LoginComponent},
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }