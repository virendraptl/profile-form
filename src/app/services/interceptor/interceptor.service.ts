import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, throwError } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  allowLogout: string[] = ['self', 'users'];
  passIntercept: boolean = false;

  constructor(private router: Router, private lstore: LocalStorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.allowLogout.forEach((api) => {
      if (request.url.includes(api)) {
        this.passIntercept = true;
      }
    });

    // let token = localStorage.getItem('token');
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
          }
          console.log(err);
          const error = err.error.message || err.statusText;
          return throwError(() => new Error(error));
        })
      );
    }

    return next.handle(request).pipe(
      catchError((err) => {
        const error = err.error.message || err.statusText;
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