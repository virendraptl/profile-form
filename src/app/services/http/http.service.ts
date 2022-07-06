import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  post(url: string, data: any, querryObj?: any) {
    url = querryObj ? this.addQueries(url, querryObj) : url;
    return this.http.post(environment.apiUrl + url, data);
  }

  postSecured(url: string, data: any, token: any, querryObj?: any) {
    url = querryObj ? this.addQueries(url, querryObj) : url;
    const headers = this.setHeaders(token);
    return this.http.post(environment.apiUrl + url, data, { headers });
  }

  get(url: string, querryObj?: any) {
    url = querryObj ? this.addQueries(url, querryObj) : url;
    return this.http.get(environment.apiUrl + url);
  }

  getSecured(url: string, token: any, querryObj?: any) {
    url = querryObj ? this.addQueries(url, querryObj) : url;
    const headers = this.setHeaders(token);
    return this.http.get(environment.apiUrl + url, { headers });
  }

  delete(url, querryObj?: any) {
    url = querryObj ? this.addQueries(url, querryObj) : url;
    return this.http.delete(environment.apiUrl + url);
  }

  deleteSecured(url: string, token: any, querryObj?: any) {
    url = querryObj ? this.addQueries(url, querryObj) : url;
    const headers = this.setHeaders(token);
    return this.http.delete(environment.apiUrl + url, { headers });
  }

  put(url: string, data: any, querryObj?: any) {
    url = querryObj ? this.addQueries(url, querryObj) : url;
    return this.http.put(environment.apiUrl + url, data);
  }

  putSecured(url: string, data: any, token: any, querryObj?: any) {
    url = querryObj ? this.addQueries(url, querryObj) : url;
    const headers = this.setHeaders(token);
    return this.http.put(environment.apiUrl + url, data, { headers });
  }

  patch(url: string, data: any, querryObj?: any) {
    url = querryObj ? this.addQueries(url, querryObj) : url;
    return this.http.patch(environment.apiUrl + url, data);
  }

  patchSecured(url: string, data: any, token: any, querryObj?: any) {
    url = querryObj ? this.addQueries(url, querryObj) : url;
    const headers = this.setHeaders(token);
    return this.http.patch(environment.apiUrl + url, data, { headers });
  }

  googleSignIn(token){
    
  }

  /**
   * It returns a new HttpHeaders object with the Content-Type and Authorization headers set
   * @param token - The token that you want to send to the server.
   * @returns A new HttpHeaders object with the content type and authorization headers.
   */
  setHeaders(token) {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * It takes a url and a query object and returns a url with the query object added to it
   * @param url - The url to which you want to add the query parameters.
   * @param querryObj - This is the object that contains the key-value pairs that you want to add to the
   * URL.
   * @returns The url with the querryObj added to it.
   */
  addQueries(url, querryObj) {
    url += '?';
    let i = 1;
    let key: any, value: any;
    for ([key, value] of Object.entries(querryObj)) {
      url += `${key}=${encodeURIComponent(value)}`;
      if (i !== Object.keys(querryObj).length) {
        url += '&';
      }
      i++;
    }
    return url;
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

// Error handling
// -----------------------------------------------------
// handleError(error: HttpErrorResponse) {
//   let errorMessage: string = '';
//   if (error.status === 0) {
//     console.error('An error occurred:', error.error);
//   } else {
//     errorMessage = `${error.message}`;
//   }
//   return throwError(() => new Error(errorMessage));
// }
