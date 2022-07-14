import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | undefined;
  isRegistered: boolean;
  hide: boolean = true;
  captchaToken: string;
  mailSent: boolean = false;
  mailNotSent: boolean = false;
  mailError: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router,
    private previousRouteService: PreviousRouteService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  ngOnInit(): void {
    this.executeImportantAction();
    console.log(this.previousRouteService.getPreviousUrl());

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
      captcha: [''],
    });
  }

  submitForm() {
    this.registerForm.patchValue({
      captcha: this.captchaToken,
    });
    console.log(this.registerForm.value);
    this.http.post('auth/register', this.registerForm.value).subscribe({
      next: (data) => {
        this.executeImportantAction();
        console.log(data);
        console.log('Token is: ', data['token']);
        this.isRegistered = !this.isRegistered;
        setTimeout(() => {
          this.sendMail(data['token']);
        }, 2000);
        // this.http
        //   .postSecured(
        //     'auth/send-verification-email',
        //     { captcha: this.captchaToken },
        //     data['token']
        //   )
        //   .subscribe({
        //     next: () => {
        //       console.log('Request sent');
        //       this.mailSent = true;
        //       this.executeImportantAction();
        //     },
        //     error: (err) => {
        //       console.log(err);
        //       this.mailNotSent = true;
        //       this.mailError = err;
        //       this.executeImportantAction();
        //     },
        //   });
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.registerForm.markAsPristine();
        this.executeImportantAction();
      },
    });
  }

  sendMail(token) {
    this.http
      .postSecured(
        'auth/send-verification-email',
        { captcha: this.captchaToken },
        token
      )
      .subscribe({
        next: () => {
          console.log('Request sent');
          this.mailSent = true;
          this.executeImportantAction();
        },
        error: (err) => {
          console.log(err);
          this.mailNotSent = true;
          this.mailError = err;
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

  public executeImportantAction(): void {
    this.recaptchaV3Service.execute('importantAction').subscribe((token) => {
      console.log(token);
      this.captchaToken = token;
    });
  }
}

// http://localhost:4200/verify-email?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmE3MDU1Y2Q1N2UyNmJjMDNkZDgxYWYiLCJpYXQiOjE2NTUxMTM1NTcsImV4cCI6MTY1NTExNzE1NywidHlwZSI6InZlcmlmeUVtYWlsIn0.G-1cSGNyanrUWfjSvWFrgEc6ngltQdZHYgPuuz4pUL8
