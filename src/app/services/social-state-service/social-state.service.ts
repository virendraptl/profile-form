import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialStateService {

  lastToken = new BehaviorSubject('');

  constructor(private authService: SocialAuthService) { }

  get socialState(){
    return this.authService;
  }
}
