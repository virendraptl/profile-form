import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { ToastrService } from 'ngx-toastr';

import { UserInfo } from 'angular-oauth2-oidc';
import {
  FacebookLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { UserRoutingModule } from '../../user/user-routing.module';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | undefined;
  user: SocialUser;
  loggedIn: boolean;

  userInfo: UserInfo;
  hide: boolean = true;

  @Output() tada = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router,
    private lstore: LocalStorageService,
    private toastr: ToastrService,
    private authService: SocialAuthService,
    private previousRouteService: PreviousRouteService,
    private toasterService: HotToastService
  ) {}

  ngOnInit(): void {
    console.log(this.previousRouteService.getPreviousUrl());

    this.delayBtn();

    // this.authService.authState.subscribe({
    //   next: (user) => {
    //     // console.log('fb log-in successful', user.authToken);
    //     console.log(
    //       user.idToken ? 'Google' : 'Facebook',
    //       'log-in successful: ',
    //       user.idToken || user.authToken
    //     );
    //     this.http
    //       .post(user.idToken ? 'auth/login/google' : 'auth/login/facebook', {
    //         // .post('auth/login/facebook', {
    //         token: user.idToken || user.authToken,
    //         // token: user.authToken,
    //       })
    //       .subscribe({
    //         next: (data) => {
    //           this.lstore.setToken(data['token']);
    //           this.router.navigate(['/user/my-profile']);
    //         },
    //         error: (error) => {
    //           console.log(error);
    //         },
    //       });
    //   },
    //   error: (err) => {
    //     console.log('error: ', err);
    //   },
    // });

    let checkToken = this.lstore.getToken();
    if (checkToken) {
      this.router.navigate(['/user/my-profile']);
      // this.toastr.info('User already logged in! Redirecting to profile page');
      this.toasterService.info(
        'User already logged in! Redirecting to profile page'
      );
    }
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])([A-Za-z0-9]+)$'),
        ],
      ],
    });
  }

  submitForm() {
    console.log(this.loginForm.value);
    this.http.post('auth/login', this.loginForm.value).subscribe({
      next: (data) => {
        console.log(data);
        this.lstore.setToken(data['token']);
        this.router.navigate(['/user/my-profile']);
      },
      error: (error) => {
        console.log('Error in login is: ', error.message);
        this.errorMessage = error.message;
        this.loginForm.markAsPristine();
      },
    });
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email field can not be empty';
    }

    return this.email.hasError('pattern') ? 'Not a valid email' : '';
  }
  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password field can not be empty';
    }

    if (this.password.hasError('pattern')) {
      return 'Password must have at least 1 number & 1 character';
    }

    return this.password.hasError('minlength')
      ? 'Password must have at least 8 characters'
      : '';
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  registerbtn() {
    this.router.navigate(['/auth/register']);
  }

  delayBtn() {
    setTimeout(() => {
      this.authService.authState.subscribe({
        next: (user) => {
          // console.log('fb log-in successful', user.authToken);
          console.log(
            user.idToken ? 'Google' : 'Facebook',
            'log-in successful: ',
            user.idToken || user.authToken
          );

          if (user.idToken) {
            this.http
              // .post(user.idToken ? 'auth/login/google' : 'auth/login/facebook', {
              .post('auth/login/google', {
                // token: user.idToken || user.authToken,
                token: user.idToken,
              })
              .subscribe({
                next: (data) => {
                  this.lstore.setToken(data['token']);
                  this.router.navigate(['/user/my-profile']);
                },
                error: (error) => {
                  console.log(error);
                },
              });
          }
        },
        error: (err) => {
          console.log('error in google logout: ', err);
        },
      });
    }, 1);
  }

  facebookSignin() {
    console.log('fb login clicked');
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((data) => {
      console.log('fb click data: ', data);
      this.authService.authState.subscribe({
        next: (user) => {
          // console.log('fb log-in successful', user.authToken);
          console.log(
            user.idToken ? 'Google' : 'Facebook',
            'log-in successful: ',
            user.idToken || user.authToken
          );
          this.http
            .post(user.idToken ? 'auth/login/google' : 'auth/login/facebook', {
              // .post('auth/login/facebook', {
              token: user.idToken || user.authToken,
              // token: user.authToken,
            })
            .subscribe({
              next: (data) => {
                this.lstore.setToken(data['token']);
                this.router.navigate(['/user/my-profile']);
              },
              error: (error) => {
                console.log(error);
              },
            });
        },
        error: (err) => {
          console.log('error in fb logout: ', err);
        },
      });
    });
  }

  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data) => {
  //     console.log(data);
  //     console.log('Login successful');
  //   });
  // }
}

// error handling reference
// https://www.youtube.com/watch?v=TmTGQiLBS5A

// company: "Rvmp Inc"
// email: "abcd@cdef.com"
// name: "Ab Pt"
// password: "qwer1234"

// company: "Stark Inc"
// email: "king@north.com"
// name: "Jon Snow"
// password: "1212qwqw"

// login with TLS serctificate
// created a certificate signed by mkcert
// https://web.dev/how-to-use-local-https/
// for commands: follow https://www.devdungeon.com/content/how-serve-angular-locally-over-https
// in CLI, follow:
// ng serve --ssl --ssl-cert localhost.pem --ssl-key localhost-key.pem
// change browser url to https://localhost:4200/auth/login

// https://stackoverflow.com/questions/46349459/chrome-neterr-cert-authority-invalid-error-on-self-signing-certificate-at-loca
