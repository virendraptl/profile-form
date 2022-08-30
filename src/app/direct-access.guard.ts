import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { PreviousRouteService } from './services/previous-route/previous-route.service';

@Injectable({
  providedIn: 'root',
})
export class DirectAccessGuard implements CanActivate {
  constructor(
    private router: Router,
    private toaster: ToastrService,
    private toasterService: HotToastService,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('Routes:', route.routeConfig.path, this.router.url);
    if(this.router.url == '/cart' && route.routeConfig.path == 'checkout'){
      return true;
    }
    if(this.router.url == '/cart/checkout' && route.routeConfig.path == 'payment/:id'){
      return true;
    }
    if(this.router.url == '/profile' && route.routeConfig.path == 'payment/:id'){
      return true;
    }
    this.router.navigate(['/']);
    // this.toaster.error('User not logged in! Redirectig to login page')
    this.toasterService.error(
      'Direct access not allowed'
    );
    return false;
  }
}
