import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { TableDataService } from 'src/app/services/table-data/table-data.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';
import { MatMenuTrigger } from '@angular/material/menu';

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
  loginUrl: string = '/seller/auth/login';

  hideAvatar: boolean = true;
  menuOpen = false;
  customerName:string;

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

  cartCount: number;

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
    this.headerTitleService.customerName.subscribe((name)=> {
      this.customerName = name;
    })

    this.lstore.cartCount.subscribe((count) => {
      this.cartCount = count;
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
    let currentUrl = this.previousRouteService.getCurrentUrl();
    if (this.backUrl != currentUrl && this.backUrl) {
      this.router.navigate([this.backUrl]);
    } else {
      this.router.navigate([this.previousRouteService.getDefPrevUrl()]);
    }
  }

  goHome() {
    console.log('home clicked!!');
    if (this.router.url.includes('seller')) {
      this.router.navigate(['/seller/user/my-profile']);
    } else {
      this.table.setProdSearchTerm('');
      this.router.navigate(['/']);
    }
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  closeMenu(menuTrigger) {
    this.menuOpen = false;
    setTimeout(() => {
      if (!this.menuOpen) {
        menuTrigger.closeMenu();
      }
    }, 1000);
  }

  toCustomerLogin(){
    this.router.navigate(['/auth'])
  }
}
