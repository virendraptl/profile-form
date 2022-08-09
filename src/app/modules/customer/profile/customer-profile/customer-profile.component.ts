import { Component, OnInit } from '@angular/core';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css'],
})
export class CustomerProfileComponent implements OnInit {
  currentData: any;
  loading: boolean = true;

  constructor(
    private http: HttpService,
    private previousRouteService: PreviousRouteService,
    private lstore: LocalStorageService,
    private headerTitleService: HeaderTitleService
  ) {
    this.headerTitleService.setTitle('Account Details');
  }

  ngOnInit(): void {
    this.previousRouteService.setDefPrevUrl('/');
    this.http
      .getSecured('shop/auth/self', this.lstore.getCustomerToken())
      .subscribe({
        next: (data) => {
          this.currentData = data;
          console.log(this.currentData);
          this.loading = false;
        },
        error: (error) => {
          console.log(error);
          // this.location.back();
        },
      });
  }
}
