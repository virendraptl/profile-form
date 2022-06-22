import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  tempToken: string;
  profileData: any;

  constructor(
    private http: HttpService,
    private router: Router,
    private lstore: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.http.get('auth/self').subscribe({
      next: (res: any) => {
        this.profileData = res;
        console.log('profile data from service:- ', this.profileData);
      },
    });
  }

  logout() {
    this.lstore.logout();
  }
}


// company: "Rvmp Inc"
// email: "abcd@cdef.com"
// name: "Ab Pt"
// password: "qwer1234"

// company: "Stark Inc"
// email: "king@north.com"
// name: "Jon Snow"
// password: "1212qwqw"

// httpInterceptor for token expiry
// --------------------------------
// @Injectable() 
// export class ErrorInterceptor implements HttpInterceptor { 
// constructor(private authentiationService: AuthenticationService) { } 
// intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
//      return next.handle(request).
//               pipe(catchError(err => { 
//       if (err.status === 401) {      
//           this.authentiationService.logout();
//           location.reload(); } 
//           const error = err.error.message || err.statusText; 
//           return throwError(error); 
//     }))
//  } 
// }