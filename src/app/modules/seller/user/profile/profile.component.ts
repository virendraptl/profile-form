import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  tempToken: string;
  profileData: any;
  errorMsg: any;
  avatarStyle = {
    cursor: 'pointer',
  };

  constructor(
    private http: HttpService,
    private lstore: LocalStorageService,
    public previousRouteService: PreviousRouteService,
    private headerTitleService: HeaderTitleService
  ) {
    this.headerTitleService.setTitle('Profile');
  }

  ngOnInit(): void {
    this.previousRouteService.setDefPrevUrl('/seller/user/my-profile');
    this.http.get('auth/self').subscribe({
      next: (res: any) => {
        this.profileData = res;
        console.table(this.profileData);
        this.headerTitleService.userName.next(this.profileData.name);
      },
      error: (err) => {
        console.log('Page could not load:', err.message);
        this.errorMsg = err.message;
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
