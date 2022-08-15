import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from '../http/http.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderTitleService {
  title = new BehaviorSubject('');
  userName = new BehaviorSubject('');
  customerName = new BehaviorSubject('');

  constructor(private storage: LocalStorageService, private http: HttpService) {
    let token = storage.getToken();
    if(token){
      this.http.get('auth/self').subscribe({
        next: (res: any) => {
          this.userName.next(res.name);
        },
      });
    }
   
    // this.getCustomerData();

     let customerToken = this.storage.getCustomerToken();
     console.log('customer token: ', customerToken);
     if (customerToken) {
       console.log('getting customer data in header title service');
       this.http.getSecured('shop/auth/self', customerToken).subscribe({
         next: (res: any) => {
           console.log('customer name: ', res['name']);
           this.customerName.next(res['name']);
         },
       });
     }
  }

  getCustomerData(){
     let customerToken = this.storage.getCustomerToken();
     console.log('customer token: ', customerToken);
     if (customerToken) {
       console.log('getting customer data in header title service');
       this.http.getSecured('shop/auth/self', customerToken).subscribe({
         next: (res: any) => {
           console.log('customer name: ', res['name']);
           this.customerName.next(res['name']);
         },
       });
     }
  }

  setTitle(title: string) {
    this.title.next(title);
  }

  setName(name: string){
    this.userName.next(name);
    this.userName.subscribe((res) => console.log('Rxjs updated name is: ',res))
  }
}
