import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { first } from 'rxjs';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  userToken: string;
  paymentForm: FormGroup;
  productId: string;
  loading:boolean = true;
  orderInfo:any;

  constructor(
    private http: HttpService,
    private previousRouteService: PreviousRouteService,
    private lstore: LocalStorageService,
    private headerTitleService: HeaderTitleService,
    private toasterService: HotToastService,

    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.headerTitleService.setTitle('Order Payment');
  }

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('current product id:', this.productId);

    this.previousRouteService.setDefPrevUrl('/');
    this.userToken = this.lstore.getCustomerToken();
    this.getOrderInfo();
    this.createPaymentForm();
    
  }

  getOrderInfo(){
     this.http
       .getSecured('shop/orders/' + this.productId, this.userToken)
       .subscribe({
         next: (data) => {
           this.orderInfo = data[0];
           console.log('Order Info', this.orderInfo);
           this.loading = false;
         },
         error: (err) => {
           console.log('Error', err);
         },
       });
  }

  createPaymentForm() {
    this.paymentForm = this.fb.group({
      nameOnCard: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      expiry: ['', [Validators.required]],
      cvv: ['', [Validators.required]],
    });
  }

  finalPayment() {
    console.log(this.paymentForm.value);
    this.http
      .putSecured(
        `shop/orders/confirm/${this.productId}`,
        this.paymentForm.value,
        this.userToken
      )
      .subscribe({
        next: (data) => {
          this.toasterService.success('Order Placed!');
          console.log(data);
          this.router.navigate(['/']);
        },
        error: (error) => {
          // this.toasterService.error(error.message);
          console.log('error after payment:', error.message);
        },
      });
  }
}
