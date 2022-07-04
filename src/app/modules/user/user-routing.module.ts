import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { ProfileComponent } from './profile/profile.component';



const routes: Routes = [
    {
      path:'my-profile', component: ProfileComponent, canActivate: [AuthGuard]
    }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }