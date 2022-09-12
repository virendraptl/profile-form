import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { ReCaptchaV3Service } from 'ng-recaptcha';
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
  captchaToken: string;

  passwordForm: FormGroup;

  constructor(
    private http: HttpService,
    private lstore: LocalStorageService,
    public previousRouteService: PreviousRouteService,
    private headerTitleService: HeaderTitleService,
    private toasterService: HotToastService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private fb: FormBuilder
  ) {
    this.headerTitleService.setTitle('Profile');
  }

  ngOnInit(): void {
    this.executeImportantAction();
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
    this.createPasswordForm();
  }

  logout() {
    this.lstore.logout();
  }

  sendMail() {
    this.http
      .post('auth/send-verification-email?captcha=false', '')
      // .post(
      //   'auth/send-verification-email', '',
      //   { captcha: this.captchaToken },

      // )
      .subscribe({
        next: () => {
          console.log('Request sent');
          // this.mailSent = true;
          this.executeImportantAction();
        },
        error: (err) => {
          console.log(err);
          // this.mailNotSent = true;
          // this.mailError = err;
          this.executeImportantAction();
        },
      });
  }

  createPasswordForm() {
    this.passwordForm = this.fb.group({
      old_password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[A-Za-z])(?=.*[0-9])([A-Za-z0-9$@$!%.+=^)(\\*?&#_-]+)$'
          ),
        ],
      ],
      new_password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[A-Za-z])(?=.*[0-9])([A-Za-z0-9$@$!%.+=^)(\\*?&#_-]+)$'
          ),
        ],
      ],
    });
  }

  public executeImportantAction(): void {
    this.recaptchaV3Service.execute('importantAction').subscribe((token) => {
      console.log(token);
      this.captchaToken = token;
    });
  }

  showOldPwError() {
    const title = this.passwordForm.get('old_password');
    if (title.touched && title.invalid) {
      if (title.getError('required')) {
        return 'Password is required';
      }
      if (title.getError('minlength')) {
        return 'Min 8 characters are required';
      }
      if (title.getError('pattern')) {
        return 'Password must have at least 1 number & 1 character';
      }
    }
    return null;
  }

  showNewPwError() {
    const title = this.passwordForm.get('new_password');
    if (title.touched && title.invalid) {
      if (title.getError('required')) {
        return 'Password is required';
      }
      if (title.getError('minlength')) {
        return 'Min 8 characters are required';
      }
      if (title.getError('pattern')) {
        return 'Password must have at least 1 number & 1 character';
      }
    }
    return null;
  }

  changePassword() {
    this.http
      .post('users/auth/change-password', this.passwordForm.value)
      .subscribe({
        next: (data) => {
          this.toasterService.success('Password Changed!!!')
        },
        error: (err) => {
          console.log(err.message);
          // this.toasterService.error(err.message)
        },
      });
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
