import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {
  previousUrl:string;
  currentUrl:string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        // console.log('Prev URL: ', this.previousUrl);
        // console.log('Current URL: ', this.currentUrl);
      }
    })
   }

   getPreviousUrl(){
    return this.previousUrl;
   }

   getCurrentUrl(){
    return this.currentUrl;
   }
}

// Source:- https://dev.to/slk5611/how-to-access-the-previous-route-in-your-angular-app-5db0