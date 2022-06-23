import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | undefined;
  isRegistered: boolean = true;
  isLoading: boolean = true;
  currentId: string;
  currentData: any;
  tempurl: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private storage: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentId = this.activatedRoute.snapshot.paramMap.get('id');
    this.tempurl = `users/${this.currentId}`;
    console.log('User id for preload req: ', this.currentId);
    // this.http.get(`users/${this.currentId}`).subscribe({
    this.http.get(this.tempurl).subscribe({
      next: (data) => {
        this.currentData = data;
        // console.log('Form entries preload data: ', this.currentData);
        this.createForm();
      },
    });
  }

  createForm() {
    this.registerForm = this.fb.group({
      name: [this.currentData.name, [Validators.required]],
      email: [this.currentData.email, [Validators.required, Validators.email]],
      password: [this.currentData.password, [Validators.required]],
    });
    this.isLoading = false;
  }

  submitForm() {
    console.log(this.registerForm.value);

    this.http.patch(this.tempurl, this.registerForm.value).subscribe({
      next: (data) => {
        console.log('User Data Updated! ', data);

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
}
