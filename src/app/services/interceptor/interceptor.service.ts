import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  // created an array containing URL keywords specific to logged-in state, to direct the intercept to add locally stored token as header and applying forced logout if token is expired or invalid
  allowLogout: string[] = ['self', 'users', 'products'];
  passIntercept: boolean = false;
  passCustomerIntercept: boolean = false;

  constructor(
    private lstore: LocalStorageService,
    private toasterService: HotToastService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    /* This is checking if the request url contains any of the keywords in the allowLogout array. If it
   does, it will check if the request url contains the keywords 'shop' or 'customers'. If it does
   not, it will set the passIntercept variable to true. If it does, it will set the passIntercept
   variable to false. */
    this.allowLogout.forEach((api) => {
      if (request.url.includes(api)) {
        if (
          !request.url.includes('shop') &&
          !request.url.includes('customers')
        ) {
          this.passIntercept = true;
          console.log('added header for', request.url);
        } else {
          this.passIntercept = false;
        }
      }
    });

    /* This is checking if the request url contains any of the keywords in the allowLogout array. If it
   does, it will check if the request url contains the keywords 'shop' or 'customers'. If it does
   not, it will set the passIntercept variable to true. If it does, it will set the passIntercept
   variable to false. */
    let token = this.lstore.getToken();
    if (token && this.passIntercept) {
      let clonedReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(clonedReq).pipe(
        catchError((err) => {
          if (err.status === 401 && this.passIntercept) {
            console.log('Forced logout because token is expired or invalid!!!');
            this.lstore.logout();
            this.toasterService.error(
              'Forced Logout: User Authentication Error'
            );
          } else {
            let error;

            error = err.error.message || err.statusText;
            this.toasterService.error(error);
          }
          console.log(err);
          const error = err.error.message || err.statusText;
          return throwError(() => new Error(error));
        })
      );
    }

    return next.handle(request).pipe(
      catchError((err) => {
        let error;
        if (err.status === 401 && !this.passIntercept) {
          console.log(
            'Forced logout because customer token is expired or invalid!!!'
          );
          this.lstore.customerLogOut();
          this.toasterService.error('Forced Logout: User Authentication Error');
          this.router.navigate(['/']);
        } else {
          error = err.error.message || err.statusText;
          this.toasterService.error(error);
        }
        return throwError(() => new Error(error));
      })
    );
  }
}

// reference:
// https://agdev-tech.medium.com/angular-authentication-interceptors-and-guards-d234cfb12260
// https://www.tektutorialshub.com/angular/angular-httpclient-http-interceptor/
// https://medium.com/angular-in-depth/top-10-ways-to-use-interceptors-in-angular-db450f8a62d6
// https://medium.com/@ryanchenkie_40935/angular-authentication-using-the-http-client-and-http-interceptors-2f9d1540eb8

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//   constructor(public auth: AuthService) {}
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//     request = request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${this.auth.getToken()}`
//       }
//     });
//     return next.handle(request);
//   }
// }
