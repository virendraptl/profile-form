import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocialStateService {

  constructor(private authService: SocialAuthService) { }

  get socialState(){
    return this.authService;
  }
}
