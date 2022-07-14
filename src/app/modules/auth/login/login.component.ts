import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { ToastrService } from 'ngx-toastr';

import { UserInfo } from 'angular-oauth2-oidc';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { UserRoutingModule } from '../../user/user-routing.module';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';
import { HotToastService } from '@ngneat/hot-toast';
import { SocialStateService } from 'src/app/services/social-state-service/social-state.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';

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
  lastToken: string;
  currentToken: string;

  userInfo: UserInfo;
  hide: boolean = true;

  captchaToken: string;

  socialState;

  @Output() tada = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router,
    private lstore: LocalStorageService,
    private toastr: ToastrService,
    private authService: SocialAuthService,
    private previousRouteService: PreviousRouteService,
    private toasterService: HotToastService,
    private stateService: SocialStateService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
    stateService.lastToken.subscribe((value) => {
      this.lastToken = value;
      console.log('Social token last value: ', this.lastToken);
    });
  }

  ngOnInit(): void {
    this.executeImportantAction();
    let checkToken = this.lstore.getToken();
    if (checkToken) {
      this.router.navigate(['/user/my-profile']);
      // this.toastr.info('User already logged in! Redirecting to profile page');
      this.toasterService.info(
        'User already logged in! Redirecting to profile page'
      );
    }

    // this.googleLogin();

    // replace above googleLogin() method with the code below for Google & FB combined auth state subscribe & login. kept seperate to avoid fb auto login, restricting it to click event

    this.authService.authState.subscribe({
      next: (user) => {
        console.log('User info: ', user);
        // console.log('fb log-in successful', user.authToken);
        console.log(
          user?.idToken
            ? 'Google'
            : user?.authToken
            ? 'Fb'
            : 'No valid token, No',
          'log-in: ',
          user?.idToken || user?.authToken
        );

        this.currentToken = user?.idToken || user?.authToken || 'invalid_token';
        console.log(
          this.lastToken != this.currentToken
            ? 'Tokens are different'
            : 'Tokens are same'
        );

        // if(true){
        if (this.lastToken != this.currentToken && this.currentToken != 'invalid_token') {
          console.log('Social token current value: ', this.currentToken);
          this.stateService.lastToken.next(this.currentToken);
          this.http
            .post(
              user?.idToken
                ? 'auth/login/google'
                : user?.authToken
                ? 'auth/login/facebook'
                : '',
              {
                token: user?.idToken || user?.authToken,
                captcha: this.captchaToken,
              }
            )
            .subscribe({
              next: (data) => {
                this.lstore.setToken(data['token']);
                this.router.navigate(['/user/my-profile']);
                this.executeImportantAction();
              },
              error: (error) => {
                console.log(error);
                this.executeImportantAction();
              },
            });
        }
      },
      error: (err) => {
        console.log('error: ', err);
        this.executeImportantAction();
      },
    });

    this.createForm();
  }

  // ngOnDestroy() {
  //   console.log('login component destroyed!!!');
  //   this.socialState.unsubscribe();
  // }

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
      captcha: [''],
    });
  }

  submitForm() {
    this.loginForm.patchValue({
      captcha: this.captchaToken,
    });
    console.log(this.loginForm.value);
    this.http.post('auth/login', this.loginForm.value).subscribe({
      next: (data) => {
        console.log(data);
        this.lstore.setToken(data['token']);
        this.router.navigate(['/user/my-profile']);
        this.executeImportantAction();
      },
      error: (error) => {
        console.log('Error in login is: ', error.message);
        this.errorMessage = error.message;
        this.loginForm.markAsPristine();
        this.executeImportantAction();
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

  googleLogin() {
    let googleService = this.authService.authState.subscribe({
      next: (user) => {
        // console.log('fb log-in successful', user.authToken);

        if (user.idToken) {
          console.log('Google log-in successful! token: ', user.idToken);
          this.http
            // .post(user.idToken ? 'auth/login/google' : 'auth/login/facebook', {
            .post('auth/login/google?captcha=false', {
              token: user.idToken,
              captcha: this.captchaToken,
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
  }

  loginTest() {
    console.log('clicked on social login button: ');
  }

  facebookSignin() {
    console.log('fb login clicked');
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    console.log('after fb provider process');
    // .then((data) => {
    //   console.log('fb click data: ', data);
    //   this.authService.authState.subscribe({
    //     next: (user) => {
    //       // console.log('fb log-in successful', user.authToken);
    //       console.log('Facebook log-in successful: ', user.authToken);
    //       this.http
    //         .post('auth/login/facebook?captcha=false',
    //           {
    //             // .post('auth/login/facebook', {
    //             token: user.authToken,
    //             // token: user.authToken,
    //           }
    //         )
    //         .subscribe({
    //           next: (data) => {
    //             this.lstore.setToken(data['token']);
    //             this.router.navigate(['/user/my-profile']);
    //           },
    //           error: (error) => {
    //             console.log(error);
    //           },
    //         });
    //     },
    //     error: (err) => {
    //       console.log('error in fb logout: ', err);
    //     },
    //   });
    // });
  }

  public executeImportantAction(): void {
    this.recaptchaV3Service.execute('importantAction').subscribe((token) => {
      console.log(token);
      this.captchaToken = token;
    });
  }
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

// TLS commands
// * sudo pacman -Syu mkcert
// * brew install mkcert
// *  wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64
// * sudo cp mkcert-v1.4.3-linux-amd64 /usr/local/bin/mkcert
// *  sudo chmod +x /usr/local/bin/mkcert
// *  mkcert -install
// * mkcert localhost
// * ng serve --ssl --ssl-cert localhost.pem --ssl-key localhost-key.pem

// https://stackoverflow.com/questions/46349459/chrome-neterr-cert-authority-invalid-error-on-self-signing-certificate-at-loca

// eyJhbGciOiJSUzI1NiIsImtpZCI6IjFiZDY4NWY1ZThmYzYyZDc1ODcwNWMxZWIwZThhNzUyNGM0NzU5NzUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NTc1OTkxNzAsImF1ZCI6Ijg5MzkxMzgwNTIwMi1yZzdvNnNvbWN0cTIxaWtlNmRrMXUwZDY5NnQ2NGUwcS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwOTQ4OTQxODM0NDQ5OTA1NDcwNCIsImVtYWlsIjoidmlyZW5kcmEucGF0aWwyNTNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6Ijg5MzkxMzgwNTIwMi1yZzdvNnNvbWN0cTIxaWtlNmRrMXUwZDY5NnQ2NGUwcS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsIm5hbWUiOiJWaXJlbmRyYSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BSXRidm1rQTF5LTg4dTJHc3pBU2pUSjgwWDRWUlRCUTdVTHpNaEpNZkg5YWlRPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlZpcmVuZHJhIiwiaWF0IjoxNjU3NTk5NDcwLCJleHAiOjE2NTc2MDMwNzAsImp0aSI6IjMzNzc5NjEwOTAyZTgxZjM2MDE5YzA1OTYyYTcwOGYyOTlhNTEzNGQifQ.Ym_mhtdAlkIvQGq5Xa5gaqHBCdzjl6UY1YRJ8ACkc4egnPh-zkev0aJ3SXdMZVUffcI7XQCEPtD7Xp5atcMC7ma8n-ATkoHZPUoxkFwbgL93mOm1mLX2H5Y1SbpzTQDZioPeyExaAKA0l4fFMA-RIVlwtQsHEWdsFz7IC0mwWu-tYWpSllPlN1eKbmGhBVRrm2tIjL0lQbqwMyApIoU8Vgj7Qp8AKBxMHKBmEOLBwpYQ_0pj481Ar9hESkQZzstbclFSFOk4mCJzUE3xnEI688MLT7qHMuaj-yALawpkBLpzYSMrG9r7Uu-SL_tJUzJsWAbBBfGJhMMWik9wqUHcCg

// eyJhbGciOiJSUzI1NiIsImtpZCI6IjFiZDY4NWY1ZThmYzYyZDc1ODcwNWMxZWIwZThhNzUyNGM0NzU5NzUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NTc1OTkyMDAsImF1ZCI6Ijg5MzkxMzgwNTIwMi1yZzdvNnNvbWN0cTIxaWtlNmRrMXUwZDY5NnQ2NGUwcS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwOTQ4OTQxODM0NDQ5OTA1NDcwNCIsImVtYWlsIjoidmlyZW5kcmEucGF0aWwyNTNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6Ijg5MzkxMzgwNTIwMi1yZzdvNnNvbWN0cTIxaWtlNmRrMXUwZDY5NnQ2NGUwcS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsIm5hbWUiOiJWaXJlbmRyYSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BSXRidm1rQTF5LTg4dTJHc3pBU2pUSjgwWDRWUlRCUTdVTHpNaEpNZkg5YWlRPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlZpcmVuZHJhIiwiaWF0IjoxNjU3NTk5NTAwLCJleHAiOjE2NTc2MDMxMDAsImp0aSI6IjdiOGQ2NjJhZjUwOTAwYzM5ZTY5ODBmZmVmMGE3YTY0Njk1MTRjY2QifQ.BzTBDa6rVTCLN8nj4lpEgGDNFWhYFdSUyb8-_qRZlD6k94VZAy6dFWFVO6AmCmDNU2entMWlBjVizGdeHnVdYF3EDdZXOiILAV9j8MZ0qr-3O91UhTIrd51f3HBE1hZYVyMjmrHVpze6s5sEYTc0vzlaCBYlzGkCuUOxkbZ1R4pcihqiDpHvU4PFug4mcwQKoaGjJc9aQPoeJiuLM1xvU0Ce2On9ZyxlEcBO48-q35yXCmp7kP2Qbs1bWef3shFjrTmWsZ0vNoEHBr_MLkek4so8BiBk3YikjsrOtaCvPTkda1OA7-xPFkjpV1NY2rRsl70crjujAZtiGXOO2cBpVQ

// EAAFMf9J4GGIBAJA9P4uevlftCLViinwLoKXpZC4VfnKfZCsZAt8VCP8IZBhXCPzY6tYVFkZBpDYujepvZCyNP2nYnXuVUTqLiRMAzXeuaszLyEzVZCUtolgZBYsHgCJP4dLP9SYT6l0ZClZATuMOLxwGEzh2hPEtNnyaoLDH6yxogl7o937crzVl3ZBZA5SR1K8BvqUJPCAdZCWbdWTZAYKzmHbrsO

// EAAFMf9J4GGIBAALKdBEFIbRmsorUItqUaiZBsmQvDS6sBJGHCAA74mD2CpRQi0fgll6ZAoHv225RyZAqJVvOz6J75nDQoY4AvqB5Mddlh0xwLOY0jZCMFl3xZBZA2pZCAzg9ZCoRItZCALAdDE86BxSK8uzTfmXOc64Rkn7oZAkq6OupZAJoXJjDbFN7ZCUjTjqJAWRoZCxtBkt2FXFFzR04iU0cs
