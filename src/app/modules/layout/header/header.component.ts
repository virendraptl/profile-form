import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { TableDataService } from 'src/app/services/table-data/table-data.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() btns: string[];
  title = '';

  avatarStyle = {
    fontSize: '20px',
    fontWeight: '600',
    border: '2px solid #ccc',
    borderRadius: '100vmax',
  };

  profileData = {
    name: '',
    isEmailVerified: '',
  };

  constructor(
    private headerTitleService: HeaderTitleService,
    private lstore: LocalStorageService,
    private router: Router,
    private table: TableDataService,
    private previousRouteService: PreviousRouteService
  ) {}

  logout() {
    this.lstore.logout();
  }

  showList() {
    this.router.navigate(['/users']);
  }

  newUser() {
    this.router.navigate(['/users/create']);
  }

  toProfile() {
    this.table.setData(1, 10);
    this.table.setSearch('');
    this.router.navigate(['/user/my-profile']);
  }

  ngOnInit(): void {
    this.headerTitleService.title.subscribe((updatedTitle) => {
      this.title = updatedTitle;
    });
    this.headerTitleService.userName.subscribe((userName) => {
      this.profileData.name = userName;
    });
  }

  backBtn() {
    this.router.navigate([this.previousRouteService.getPreviousUrl()]);
  }
}
