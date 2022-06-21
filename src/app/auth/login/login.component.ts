import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileDataService } from 'src/app/profile-data.service';
// import * as alertyfy from 'alertifyjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | undefined;

  @Output() tada = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: ProfileDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let checkToken = localStorage.getItem('token');
    if (checkToken) {
      this.router.navigate(['/user/my-profile']);
    }

    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  submitForm() {
    console.log(this.loginForm.value);
    this.http.post('login', this.loginForm.value).subscribe({
      next: (data) => {
        console.log(data);
        localStorage.setItem('profileData', JSON.stringify(data));
        localStorage.setItem('token', data['token']);
        this.router.navigate(['/user/my-profile']);
      },
      error: (error) => {
        console.log('Error in login is: ', error.message);
        this.errorMessage = error.message;
        // alertyfy.error(this.errorMessage);
        this.loginForm.markAsPristine();
      },
    });
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email field can not be empty';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password field can not be empty';
    } else return '';
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
