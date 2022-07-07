import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private toaster: ToastrService,
    private toasterService: HotToastService
  ) {}

  canActivate(): boolean {
    if (!!localStorage.getItem('token')) {
      return true;
    } else {
      this.router.navigate(['auth/login']);
      // this.toaster.error('User not logged in! Redirectig to login page')
      this.toasterService.error('User not logged in! Redirectig to login page');
      return false;
    }
  }

  // isLoggedIn():boolean {
  //   if(this.http.loginStatus()){
  //     this.router.navigate(['/my-profile']);
  //     return false;
  //   }else{
  //     return true;
  //   }
  // }
}
