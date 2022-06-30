import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | undefined;
  isRegistered: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isRegistered = false;

    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      company: ['', [Validators.required]],
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
    console.log(this.registerForm.value);
    this.http.post('auth/register', this.registerForm.value).subscribe({
      next: (data) => {
        console.log(data);
        console.log('Token is: ', data['token']);
        this.http
          .postSecured('auth/send-verification-email', data['token'], '')
          .subscribe(() => {
            console.log('Request sent');
          });
        this.isRegistered = !this.isRegistered;
      },
      error: (error) => {
        console.log('Error in register is: ', error.message);
        this.errorMessage = error.message;
        this.registerForm.markAsPristine();
      },
    });
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email field can not be empty';
    }

    return this.email.hasError('pattern') ? 'Not a valid email' : '';
  }
  getNameErrorMessage() {
    if (this.name.hasError('required')) {
      return 'Name field can not be empty';
    } else return '';
  }
  getCompanyErrorMessage() {
    if (this.company.hasError('required')) {
      return 'Company field can not be empty';
    } else return '';
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
    return this.registerForm.get('email');
  }
  get name() {
    return this.registerForm.get('name');
  }
  get company() {
    return this.registerForm.get('company');
  }
  get password() {
    return this.registerForm.get('password');
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

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmE3MDU1Y2Q1N2UyNmJjMDNkZDgxYWYiLCJpYXQiOjE2NTUxMTMwNTIsImV4cCI6MTY1NTE5OTQ1MiwidHlwZSI6ImFjY2VzcyJ9.7mhQSGcunGR3IBouJTjFrF9cwxsjzJprLSp-18sVEis

// http://localhost:4200/verify-email?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmE3MDU1Y2Q1N2UyNmJjMDNkZDgxYWYiLCJpYXQiOjE2NTUxMTM1NTcsImV4cCI6MTY1NTExNzE1NywidHlwZSI6InZlcmlmeUVtYWlsIn0.G-1cSGNyanrUWfjSvWFrgEc6ngltQdZHYgPuuz4pUL8
