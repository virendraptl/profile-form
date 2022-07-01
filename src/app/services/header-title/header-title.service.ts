import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderTitleService {
  title = new BehaviorSubject('');
  userName = new BehaviorSubject('');

  constructor() {}

  setTitle(title: string) {
    this.title.next(title);
  }

  setName(name: string){
    this.userName.next(name);
  }
}
