import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {
  registerForm: FormGroup;
  loginForm: FormGroup;

  regErrMsg: string;
  loginErrMsg: string;
  captchaToken: string;

  constructor(
    private headerTitleService: HeaderTitleService,
    private fb: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private lstore: LocalStorageService,
    private router: Router,
    private http: HttpService,
    private prevRoute: PreviousRouteService
  ) {
    this.headerTitleService.setTitle('Registration');
  }

  ngOnInit(): void {
    this.executeImportantAction();

    this.createLoginForm();
    this.createRegisterForm();
  }

  createLoginForm() {
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

  createRegisterForm() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      captcha: [''],
      addresses: this.fb.group({
        street: ['', [Validators.required]],
        addressLine2: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        pin: ['', [Validators.required]],
      }),
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
    });
  }

  executeImportantAction(): void {
    this.recaptchaV3Service.execute('importantAction').subscribe((token) => {
      console.log('Captcha token is: ', token);
      this.captchaToken = token;
    });
  }

  submitLoginForm() {
    this.loginForm.patchValue({
      captcha: this.captchaToken,
    });
    console.log(this.loginForm.value);
    this.http.post('shop/auth/login', this.loginForm.value).subscribe({
      next: (data) => {
        console.log(data);
        this.lstore.setCustomerToken(data['token']);
        this.headerTitleService.customerName.next(data['customer']['name']);
        let url =
          this.prevRoute.getPreviousUrl() == this.prevRoute.getCurrentUrl()
            ? '/'
            : this.prevRoute.getPreviousUrl();
        console.log('Prev url: ', url);
        this.router.navigate([url]);
        this.executeImportantAction();
      },
      error: (error) => {
        console.log('Error in login is: ', error.message);
        this.loginErrMsg = error.message;
        this.loginForm.markAsPristine();
        this.executeImportantAction();
      },
    });
  }

  submitRegisterForm() {
    this.registerForm.patchValue({
      captcha: this.captchaToken,
    });
    console.log(this.registerForm.value);
    this.http.post('shop/auth/register', this.registerForm.value).subscribe({
      next: (data) => {
        console.log(data);
        this.lstore.setCustomerToken(data['token']);
        this.headerTitleService.customerName.next(data['customer']['name']);
        let url =
          this.prevRoute.getPreviousUrl() == this.prevRoute.getCurrentUrl()
            ? '/'
            : this.prevRoute.getPreviousUrl();
        console.log('Prev url: ', url);
        this.router.navigate([url]);
        this.executeImportantAction();
      },
      error: (error) => {
        console.log('Error in Registeration is: ', error.message);
        this.regErrMsg = error.message;
        this.registerForm.markAsPristine();
        this.executeImportantAction();
      },
    });
  }

  get logEmail() {
    return this.loginForm.get('email');
  }

  get logPass() {
    return this.loginForm.get('password');
  }

  get regName() {
    return this.registerForm.get('name');
  }

  get regEmail() {
    return this.registerForm.get('email');
  }
  get regPass() {
    return this.registerForm.get('password');
  }
  get regAdStreet() {
    return this.registerForm.get('addresses').get('street');
  }
  get regAdLine2() {
    return this.registerForm.get('addresses').get('addressLine2');
  }
  get regAdCity() {
    return this.registerForm.get('addresses').get('city');
  }
  get regAdState() {
    return this.registerForm.get('addresses').get('state');
  }
  get regAdPin() {
    return this.registerForm.get('addresses').get('pin');
  }
}

// address api: https://github.com/harpreetkhalsagtbit/country-state-city#readme
