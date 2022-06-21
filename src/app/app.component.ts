import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  count:number = 1;
  title = 'auth-practice';
  fromChild(tada){
    console.log('Got data from child:- ', tada);
  }
}
