import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/modules/layout/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'src/app/services/http/http.service';
import { TableDataService } from 'src/app/services/table-data/table-data.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HotToastService } from '@ngneat/hot-toast';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = [
    'no',
    'name',
    'role',
    'org',
    'status',
    'edit',
    'button',
  ];
  dataSource = [];
  dataCopy = [];
  tempdata: any;
  pageIndex: number = 1;
  pageSize: number = 10;
  pageTotal: number;
  tempUrl: string = 'users';
  loadFlag: boolean = true;
  filteredTable = [];
  filteredIndex = [];
  searchTerm: string = '';
  loggedUser: string;

  avatarStyle = {
    cursor: 'pointer',
  };

  subscription: Subscription;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(
    private http: HttpService,
    public dialog: MatDialog,
    private table: TableDataService,
    private lstore: LocalStorageService,
    private toastr: ToastrService,
    private headerTitleService: HeaderTitleService,
    private toasterService: HotToastService,
    public previousRouteService: PreviousRouteService
  ) {
    this.headerTitleService.setTitle('Users List');
    this.http.get('auth/self').subscribe({
      next: (res: any) => {
        this.loggedUser = res.name;
        headerTitleService.setName = res.Name;
      },
    });
  }

  ngOnInit(): void {
    this.previousRouteService.setDefPrevUrl('/seller/user/my-profile');
    [this.pageIndex, this.pageSize] = this.table.getData();
    this.rendertable(this.tempUrl, this.pageIndex, this.pageSize);
  }

  /**
   * It takes in a url, a page index, and a page size, and then it makes a get request to the url with
   * the page index and page size as query parameters
   * @param url - the url to be called
   * @param tempindex - the current page number
   * @param tempsize - the number of rows per page
   */
  rendertable(url, tempindex, tempsize) {
    this.loadFlag = true;
    let querries = {
      page: tempindex,
      limit: tempsize,
    };
    this.http.get('users', querries).subscribe({
      next: (data) => {
        this.tempdata = data;
        this.dataSource = data['results'];
        console.table(this.dataSource);
        this.pageTotal = data['totalResults'];
        this.dataCopy = [...this.dataSource];
        this.loadFlag = false;
        if (this.table.getSearch()) {
          this.searchTerm = this.table.getSearch();
          this.searchResult(this.table.getSearch());
        }
      },
    });
  }

  changeTable(e: PageEvent) {
    this.filterReset();
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.table.setData(this.pageIndex, this.pageSize);
    this.rendertable(this.tempUrl, this.pageIndex, this.pageSize);
  }

  /**
   * The function opens a confirmation dialog box and if the user confirms, it calls the deleteUser()
   * function
   * @param {string} name - string - The name of the user to be deleted.
   * @param {string} id - The id of the user you want to delete.
   */
  openConfirmationDialog(name: string, id: string, i: number) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.confirmMessage = `Are you sure you want to delete the user: ${name} ?`;

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(name, ' Deleted!!!');
        this.deleteUser(id, name, i);
      }
      this.dialogRef = null;
    });
  }

  deleteUser(id: string, name: string, i: number) {
    this.http.delete(`users/${id}`).subscribe({
      next: (data) => {
        if (this.filteredTable.length == 0) {
          this.rendertable(this.tempUrl, this.pageIndex, this.pageSize);
        } else {
          this.filteredIndex.forEach((value, index) => {
            if (index >= i) {
              value -= 1;
              this.filteredIndex.splice(index, 1, value);
            }
          });
          this.filteredTable.splice(i, 1);
          this.filteredIndex.splice(i, 1);
          this.pageTotal -= 1;
          this.dataSource = [...this.filteredTable];
        }
        this.toasterService.success(`User: ${name} deleted!`);
      },
    });
  }

  resetTableData() {
    this.table.setData(1, 10);
    this.table.setSearch('');
  }

  toasterSuccess(message) {
    this.toastr.success(message);
  }

  searchTable(event) {
    let term = (event.target as HTMLInputElement).value.toLowerCase();
    this.table.setSearch(term);
    this.searchTerm = term;
    this.searchResult(term);
    // this.searchTest(term);
  }

  searchTest(term: string) {}

  searchResult(term: string) {
    this.dataSource = [...this.dataCopy];
    if (term && term !== '') {
      this.filterReset();
      this.dataSource.forEach((user, index) => {
        if (user.name.toLowerCase().search(term) != -1) {
          this.filteredTable.push(user);
          this.filteredIndex.push(
            index + 1 + (this.pageIndex - 1) * this.pageSize
          );
        }
      });
      this.dataSource = [...this.filteredTable];
    } else {
      this.filterReset();
    }
  }

  filterReset() {
    this.filteredTable = [];
    this.filteredIndex = [];
  }

  logout() {
    this.lstore.logout();
  }
}

// search filter custom pipe
// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'filterAll',
// })
// export class FilterPipe implements PipeTransform {
//   transform(value: any, searchText: any): any {
//     if (!searchText) {
//       return value;
//     }
//     return value.filter((data) => this.matchValue(data, searchText));
//   }

//   matchValue(data, value) {
//     return Object.keys(data)
//       .map((key) => {
//         return new RegExp(value, 'gi').test(data[key]);
//       })
//       .some((result) => result);
//   }
// }

// Angular material dialog component
// https://stackoverflow.com/questions/41684114/easy-way-to-make-a-confirmation-dialog-in-angular

// ngx-toaster
// https://www.npmjs.com/package/ngx-toastr
// Passed to ToastrService.success/error/warning/info/show()

// material snackbar
// openSnackBar(name) {
//   const config = new MatSnackBarConfig();
//   config.panelClass = ['custom-class'];
//   this.snackBar.open(`User:${name} deleted!`, 'Clear', {
//     horizontalPosition: this.horizontalPosition,
//     verticalPosition: this.verticalPosition,
//   });
// }

// using modal to show content from other component
// https://www.thecodehubs.com/open-modal-in-another-component-in-angular-13/

// reactive table example: https://stackblitz.com/edit/material-table-responsive-strict-mode?file=src%2Fapp%2Ftable-basic-example.ts,src%2Fapp%2Ftable-basic-example.html,src%2Fapp%2Fmat-table-responsive%2Fmat-table-responsive.directive.ts,src%2Fapp%2Fmat-table-responsive%2Fmat-table-responsive.directive.scss

// custom directive: https://www.freecodecamp.org/news/angular-directives-learn-how-to-use-or-create-custom-directives-in-angular-c9b133c24442/
