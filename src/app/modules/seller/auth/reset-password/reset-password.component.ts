import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  isReset: boolean;
  verifyError: boolean;
  resendBtn: boolean;
  errorMessage: string | undefined;
  token:string;
  newPassword:string;
  isLoading:boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpService
  ) {}

  ngOnInit(): void { 
    this.errorMessage = '';
    this.isReset = false;
    this.verifyError = false;

    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['token'];
      console.log('token for resetting password:', this.token);
    })
  }

  resetPassword() {
    this.isLoading = true;
    console.log('new password:', this.newPassword);
    this.http.post('auth/reset-password', {password: this.newPassword}, {token: this.token}).subscribe({next:(data)=>{
      this.isReset = true;
      this.isLoading = false;
    },
    error:(error)=>{
      console.log('error:', error);
      this.isLoading = false;
    }})
  }
}
