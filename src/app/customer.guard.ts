import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerGuard implements CanActivate {
  constructor(
    private router: Router,
    private toaster: ToastrService,
    private toasterService: HotToastService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!!localStorage.getItem('customer-token')) {
      return true;
    } else {
      this.router.navigate(['/']);
      // this.toaster.error('User not logged in! Redirectig to login page')
      this.toasterService.error('Customer not logged in! Redirectig to login page');
      return false;
    }
  }
}
