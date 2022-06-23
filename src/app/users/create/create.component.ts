import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | undefined;
  isRegistered: boolean;
  isLoading:boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isRegistered = false;

    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      role: ['user'],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.registerForm.controls['role'].disable();
    this.isLoading = false;
  }

  submitForm() {
    this.registerForm.controls['role'].enable();

    console.log(this.registerForm.value);

    this.http.post('users', this.registerForm.value).subscribe({
      next: (data) => {
        console.log('new user created! ', data);
        // console.log('Token is: ', data['token']);
        // this.http
        //   .postSecured('auth/send-verification-email', data['token'])
        //   .subscribe(() => {
        //     console.log('Request sent');
        //   });
        this.isRegistered = !this.isRegistered;
      },
      error: (error) => {
        console.log('Error in register is: ', error.message);
        this.errorMessage = error.message;
        this.registerForm.markAsPristine();
      },
    });
    this.registerForm.controls['role'].disable();
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email field can not be empty';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
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
    } else return '';
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

  createAgain() {
    this.registerForm.reset();
    this.isRegistered = !this.isRegistered;
  }
}
