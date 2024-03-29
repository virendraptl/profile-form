import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  isVerified: boolean;
  verifyError: boolean;
  resendBtn: boolean;
  errorMessage: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpService,
  ) {}

  ngOnInit() {
    this.errorMessage = '';
    this.isVerified = false;
    this.verifyError = false;

    this.activatedRoute.queryParams.subscribe((params) => {
      let token = {
        token: params['token'],
      };
      this.http.post('auth/verify-email', '', token).subscribe({
        next: () => {
          this.isVerified = true;
        },
        error: (error) => {
          this.verifyError = true;
          this.errorMessage = error.message;
        },
      });
    });
  }

  // resendMail(){
  //   let mailToken = localStorage.getItem('emailToken');
  //   this.http.sendVerifyEmail(mailToken).subscribe(
  //     ()=> {console.log('Request sent after initial failure')}
  //   );
  //   this.resendBtn = false;
  // }
}

  // get queryparams from url
  // https://www.angularjswiki.com/angular/get-query-parameters-in-angular/

  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmE4MTA4NGQ1N2UyNmJjMDNkZDg0NjIiLCJpYXQiOjE2NTUxODE0NDQsImV4cCI6MTY1NTI2Nzg0NCwidHlwZSI6ImFjY2VzcyJ9.ER0pD8Q1uvGqtpMEKEgeVoZYHkYiZoco2xmQsVrpPIw


