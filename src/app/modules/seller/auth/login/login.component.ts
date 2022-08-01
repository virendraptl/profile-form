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
    private authService: SocialAuthService,
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
    console.log('captcha token: ', this.captchaToken);
    let checkToken = this.lstore.getToken();
    if (checkToken) {
      this.router.navigate(['seller/user/my-profile']);
      this.toasterService.info(
        'User already logged in! Redirecting to profile page'
      );
    }

    // replace above googleLogin() method with the code below for Google & FB combined auth state subscribe & login. kept seperate to avoid fb auto login, restricting it to click event

    this.authService.authState.subscribe({
      next: (user) => {
        console.log('User info: ', user);
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
        if (
          this.lastToken != this.currentToken &&
          this.currentToken != 'invalid_token'
        ) {
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
                this.router.navigate(['seller/user/my-profile']);
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
          Validators.pattern(
            '^(?=.*[A-Za-z])(?=.*[0-9])([A-Za-z0-9$@$!%.+=^)(\\*?&#_-]+)$'
          ),
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
        this.router.navigate(['seller/user/my-profile']);
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
    this.router.navigate(['seller/auth/register']);
  }

  loginTest() {
    console.log('clicked on social login button: ');
  }

  facebookSignin() {
    console.log('fb login clicked');
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    console.log('after fb provider process');
  }

  public executeImportantAction(): void {
    this.recaptchaV3Service.execute('importantAction').subscribe((token) => {
      console.log('Captcha token is: ', token);
      this.captchaToken = token;
    });
  }

  // async executeImportantAction() {
  //   return await this.recaptchaV3Service.execute('importantAction');
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

// regex for password:  '^(?=.*[A-Za-z])(?=.*[0-9])([A-Za-z0-9$@$!%\.\+\=\^\)\(\\*?&#_-]+)$'
