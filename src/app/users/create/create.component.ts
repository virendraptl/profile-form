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
  createUserForm: FormGroup;
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
    this.createUserForm = this.fb.group({
      name: ['', [Validators.required]],
      role: ['user'],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])([A-Za-z0-9]+)$'),
        ],
      ],
    });
    this.createUserForm.controls['role'].disable();
    this.isLoading = false;
  }

  submitForm() {
    this.createUserForm.controls['role'].enable();

    console.log(this.createUserForm.value);

    this.http.post('users', this.createUserForm.value).subscribe({
      next: (data) => {
        console.log('new user created! ', data);
        this.isRegistered = !this.isRegistered;
      },
      error: (error) => {
        console.log('Error in register is: ', error.message);
        this.errorMessage = error.message;
        this.createUserForm.markAsPristine();
      },
    });
    this.createUserForm.controls['role'].disable();
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
    }

    if (this.password.hasError('pattern')) {
      return 'Password must have at least 1 number & 1 character';
    }

    return this.password.hasError('minlength')
      ? 'Password must have at least 8 characters'
      : '';
  }

  get email() {
    return this.createUserForm.get('email');
  }
  get name() {
    return this.createUserForm.get('name');
  }
  get company() {
    return this.createUserForm.get('company');
  }
  get password() {
    return this.createUserForm.get('password');
  }

  createAgain() {
    this.createUserForm.reset();
    this.isRegistered = !this.isRegistered;
  }
}
