import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  showHeader: boolean = false;
  url:string;
  btns:string[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader =
          this.activatedRoute.firstChild.snapshot.data['showHeader'] !== false;
      }
    });
  }

  setHeaderBtns(){
        this.url = this.router.url;
        if(this.url.includes('my-profile')){
          this.btns = ['list','logout']
        }else if(this.url.includes('update')){
          this.btns = ['back-list', 'profile', 'logout'];
        }else if(this.url.includes('details')){
          this.btns = ['back-list', 'profile', 'logout'];
        }else if(this.url.includes('create')){
          this.btns = ['back-list', 'profile', 'logout'];
        }else if (
          this.url.includes('users') &&
          !this.url.includes('update') &&
          !this.url.includes('create')
        ) {
          this.btns = ['back-profile', 'new', 'logout'];
        }
  }
}
