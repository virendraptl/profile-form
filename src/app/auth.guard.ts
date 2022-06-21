import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { HttpService } from './services/http/http.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private http: HttpService, private router: Router) {}

  canActivate(): boolean {
    if (!!localStorage.getItem('token')) {
      return true;
    } else {
      this.router.navigate(['auth/login']);
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
