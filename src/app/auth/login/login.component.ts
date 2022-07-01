import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from 'angularx-social-login';
import { UserInfo } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | undefined;
  //  public user: SocialUser = new SocialUser
  userInfo: UserInfo;

  @Output() tada = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router,
    private lstore: LocalStorageService,
    private toastr: ToastrService,
  ) {
    // this.authService.authState.subscribe(user => {
    //   this.user = user;
    //   console.log(user);
    // })
  }

  ngOnInit(): void {
    let checkToken = this.lstore.getToken();
    if (checkToken) {
      this.router.navigate(['/user/my-profile']);
      this.toastr.info('User already logged in! Redirecting to profile page');
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



  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data)=>{
  //     console.log(data);
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


