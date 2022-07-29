import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
  @Input() showAvatar: boolean;
  title = '';
  backUrl: string;
  loginUrl: string = '/auth/login';

  hideAvatar: boolean = true;

  public count = 0;

  avatarStyle = {
    fontSize: '15px',
    fontWeight: '600',
    border: '2px solid #ccc',
  };

  profileData = {
    name: '',
    isEmailVerified: '',
  };

  enteredButton: boolean = false;
  isMatMenuOpen: boolean = false;
  // isMatMenu2Open: boolean = false;
  prevButtonTrigger;

  constructor(
    private headerTitleService: HeaderTitleService,
    private lstore: LocalStorageService,
    private router: Router,
    private table: TableDataService,
    public previousRouteService: PreviousRouteService,
    private ren: Renderer2
  ) {}

  logout() {
    this.lstore.logout();
  }

  showList() {
    this.router.navigate(['/seller/users']);
  }

  showProducts() {
    this.router.navigate(['/seller/products']);
  }

  newUser() {
    this.router.navigate(['/seller/users/create']);
  }

  newProduct() {
    this.router.navigate(['/seller/products/create']);
  }

  toProfile() {
    this.table.setData(1, 10);
    this.table.setSearch('');
    this.router.navigate(['/seller/user/my-profile']);
  }

  ngOnInit(): void {
    this.headerTitleService.title.subscribe((updatedTitle) => {
      this.title = updatedTitle;
    });
    this.headerTitleService.userName.subscribe((userName) => {
      this.profileData.name = userName;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let url = this.router.url;
        if (url.includes('customer')) {
          this.hideAvatar = false;
        } else {
          this.hideAvatar = true;
        }
      }
    });
  }

  backBtn() {
    this.backUrl = this.previousRouteService.getPreviousUrl();
    if (this.backUrl !== '/seller/auth/login') {
      this.router.navigate([this.backUrl]);
    }
  }

  menuenter() {
    this.isMatMenuOpen = true;
  }

  menuLeave(trigger, button) {
    setTimeout(() => {
      if (!this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        this.ren.removeClass(
          button['_elementRef'].nativeElement,
          'cdk-focused'
        );
        this.ren.removeClass(
          button['_elementRef'].nativeElement,
          'cdk-program-focused'
        );
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80);
  }

  buttonEnter(trigger) {
    setTimeout(() => {
      if (this.prevButtonTrigger && this.prevButtonTrigger != trigger) {
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        trigger.openMenu();
      } else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger;
        trigger.openMenu();
      } else {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger;
      }
    });
  }

  buttonLeave(trigger, button) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(
          button['_elementRef'].nativeElement,
          'cdk-focused'
        );
        this.ren.removeClass(
          button['_elementRef'].nativeElement,
          'cdk-program-focused'
        );
      }
      if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(
          button['_elementRef'].nativeElement,
          'cdk-focused'
        );
        this.ren.removeClass(
          button['_elementRef'].nativeElement,
          'cdk-program-focused'
        );
      } else {
        this.enteredButton = false;
      }
    }, 100);
  }
}
