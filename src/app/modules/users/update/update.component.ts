import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  updateUserForm: FormGroup;
  errorMessage: string | undefined;
  isRegistered: boolean = true;
  isLoading: boolean = true;
  currentId: string;
  currentData: any;
  tempurl: string;
  hide: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private storage: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private headerTitleService: HeaderTitleService,
    private previousRouteService: PreviousRouteService
  ) {
    this.headerTitleService.setTitle('Update User Info');
  }

  ngOnInit(): void {
    // console.log(this.previousRouteService.getPreviousUrl());
    this.currentId = this.activatedRoute.snapshot.paramMap.get('id');
    this.tempurl = `users/${this.currentId}`;
    console.log('User id for preload req: ', this.currentId);
    this.http.get(this.tempurl).subscribe({
      next: (data) => {
        this.currentData = data;
        this.createForm();
      },
    });
  }

  createForm() {
    this.updateUserForm = this.fb.group({
      name: [this.currentData.name, [Validators.required]],
      email: [
        this.currentData.email,
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
    this.isLoading = false;
  }

  submitForm() {
    console.log(this.updateUserForm.value);

    this.http.patch(this.tempurl, this.updateUserForm.value).subscribe({
      next: (data) => {
        console.log('User Data Updated! ', data);

        this.isRegistered = !this.isRegistered;
      },
      error: (error) => {
        console.log('Error in register is: ', error.message);
        this.errorMessage = error.message;
        this.updateUserForm.markAsPristine();
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
    return this.updateUserForm.get('email');
  }
  get name() {
    return this.updateUserForm.get('name');
  }
  get company() {
    return this.updateUserForm.get('company');
  }
  get password() {
    return this.updateUserForm.get('password');
  }
}
