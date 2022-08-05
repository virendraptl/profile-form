import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {
  registerForm:FormGroup;
  loginForm:FormGroup;
  constructor(private headerTitleService: HeaderTitleService) {
        this.headerTitleService.setTitle('Registration');

  }

  ngOnInit(): void {}
}
