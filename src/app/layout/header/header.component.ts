import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { TableDataService } from 'src/app/services/table-data/table-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  title = '';

  profileData = {
    name: '',
    isEmailVerified: '',
  };

  constructor(
    private headerTitleService: HeaderTitleService,
    private lstore: LocalStorageService,
    private router: Router,
    private table: TableDataService
  ) {}

  logout() {
    this.lstore.logout();
  }

  showList() {
    this.router.navigate(['/users']);
  }
  
  toProfile() {
    this.table.setData(1, 10);
    this.table.setSearch('');
    this.router.navigate(['/user/my-profile']);
  }

  avatarStyle = {};

  ngOnInit(): void {
    this.headerTitleService.title.subscribe((updatedTitle) => {
      this.title = updatedTitle;
    });
    this.headerTitleService.userName.subscribe((userName) => {
      this.profileData.name = userName;
    });
  }
}
