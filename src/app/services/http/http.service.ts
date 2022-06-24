import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  emailVerifiedUrl = 'http://basic-api.ngminds.com/auth/verify-email?token=';

  constructor(private http: HttpClient) {}

  post(url: string, data?: any) {
    return this.http
      .post(environment.apiUrl + url, data)
      // .pipe(catchError(this.handleError));
  }

  postSecured(url: string, token: any, data?: any) {
    const headers = this.setHeaders(token);
    return this.http
      .post(environment.apiUrl + url, data, { headers })
      // .pipe(catchError(this.handleError));
  }

  get(url: string) {
    return this.http
      .get(environment.apiUrl + url)
      // .pipe(catchError(this.handleError));
  }

  // get(url: string, querryArray?: any) {
  //   console.log(querryArray);
  //   if (querryArray) {
  //     let params = new HttpParams();
  //     for (let i = 0; i < querryArray.length; i + 2) {
  //       params = params.append(querryArray[i], querryArray[i + 1]);
  //     }
  //     return this.http
  //       .get(environment.apiUrl + url, { params: params })
  //       .pipe(catchError(this.handleError));
  //   }
  //   return this.http
  //     .get(environment.apiUrl + url)
  //     .pipe(catchError(this.handleError));
  // }

  get2(url: string, querryArray?: any) {
    console.log(querryArray);
    if (querryArray) {
      let params = new HttpParams();
      for (let i = 0; i < querryArray.length; i + 2) {
        params.set(querryArray[i], querryArray[i+1])
      }
      return this.http
        .get(environment.apiUrl + url, { params: params })
        // .pipe(catchError(this.handleError));
    }
    return this.http
      .get(environment.apiUrl + url)
      // .pipe(catchError(this.handleError));
  }

  getSecured(url: string, token: any) {
    const headers = this.setHeaders(token);
    return this.http
      .get(environment.apiUrl + url, { headers })
      // .pipe(catchError(this.handleError));
  }

  delete(url) {
    return this.http
      .delete(environment.apiUrl + url)
      // .pipe(catchError(this.handleError));
  }

  deleteSecured(url: string, token: any) {
    const headers = this.setHeaders(token);
    return this.http
      .delete(environment.apiUrl + url, { headers })
      // .pipe(catchError(this.handleError));
  }

  put(url: string, data: any) {
    return this.http
      .put(environment.apiUrl + url, data)
      // .pipe(catchError(this.handleError));
  }

  putSecured(url: string, data: any, token: any) {
    const headers = this.setHeaders(token);
    return this.http
      .put(environment.apiUrl + url, data, { headers })
      // .pipe(catchError(this.handleError));
  }

  patch(url: string, data: any) {
    return this.http
      .patch(environment.apiUrl + url, data)
      // .pipe(catchError(this.handleError));
  }

  patchSecured(url: string, data: any, token: any) {
    const headers = this.setHeaders(token);
    return this.http.patch(environment.apiUrl + url, data, { headers });
  }

  emailVerify(token: any) {
    let finalUrl = this.emailVerifiedUrl + token;
    let data = '';
    return this.http
      .post<any>(finalUrl, data)
      // .pipe(catchError(this.handleError));
  }

  // handleError(error: HttpErrorResponse) {
  //   let errorMessage: string = '';
  //   if (error.status === 0) {
  //     console.error('An error occurred:', error.error);
  //   } else {
  //     errorMessage = `${error.message}`;
  //   }
  //   return throwError(() => new Error(errorMessage));
  // }

  setHeaders(token) {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
}

// assigning custom value to headers for http requests
// -----------------------------------------------
// https://www.itsolutionstuff.com/post/angular-httpclient-headers-authorization-bearer-token-exampleexample.html

// error handling
// --------------------------------------------------
// https://www.tektutorialshub.com/angular/angular-catcherror/
// https://angular.io/guide/http#handling-request-errors

// login form data post req
// ------------------------------------------
// saveLoginForm(data:any): Observable<any> {
//   console.log(environment.apiUrl);
//   return this.http.post<any>(this.loginUrl, data).pipe(catchError(this.handleError));
//   // .pipe(catchError(this.handleError('saveForm','data')));
// }

// register form data post req
// -------------------------------------------
// saveRegisterForm(data:any): Observable<any> {
//   return this.http.post<any>(this.registerUrl, data).pipe(catchError(this.handleError));
//   // .pipe(catchError(this.handleError('saveForm','data')));
// }

// get profile data without interceptor apending the token
// -----------------------------------------------------
// getProfileData(token){
//   const headers = new HttpHeaders({
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`
//   });
//   return this.http.get(this.profileUrl, {headers});
// }

// checking login ststus from authguard in the service
// ---------------------------------------------------
// loginStatus(){
//   console.log(!!localStorage.getItem('token'));
//   return !!localStorage.getItem('token');
// }

// http req to send verifn email
// -------------------------------
// sendVerifyEmail(token){
//   const headers = this.setHeaders(token);
//   console.log('headers before sending email is: ', {headers});
//   let data='';
//   return this.http.post<any>(this.sendVerificationUrl, data, {headers})
// }

// http req with dynamic params
// --------------------------------------
// searchHeroes(term: string): Observable<Hero[]> {
//   term = term.trim();

//   const options = term ?
//    { params: new HttpParams().set('name', term) } : {};

//   return this.http.get<Hero[]>(this.heroesUrl, options)
//     .pipe(
//       catchError(this.handleError<Hero[]>('searchHeroes', []))
//     );
// }
