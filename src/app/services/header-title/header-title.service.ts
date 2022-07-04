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

  constructor(private storage: LocalStorageService, private http: HttpService) {
    let token = storage.getToken();
    if(token){
      this.http.get('auth/self').subscribe({
        next: (res: any) => {
          this.userName.next(res.name);
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
