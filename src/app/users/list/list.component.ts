import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/dialog/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'src/app/services/http/http.service';
import { TableDataService } from 'src/app/services/table-data/table-data.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

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
  tempdata: any;
  pageIndex: number = 1;
  pageSize: number = 10;
  tempUrl: string = 'users';
  loadFlag: boolean = true;


  subscription: Subscription;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(
    private http: HttpService,
    public dialog: MatDialog,
    private table: TableDataService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
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
      limit: tempsize
    }
      this.http.get('users', querries).subscribe({
      next: (data) => {
        this.tempdata = data;
        this.dataSource = data['results'];
        this.loadFlag = false;
      },
    });
  }

  changeTable(e: PageEvent) {
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
  openConfirmationDialog(name: string, id: string) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.confirmMessage = `Are you sure you want to delete the user: ${name} ?`;

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(name, ' Deleted!!!');
        this.deleteUser(id, name);
      }
      this.dialogRef = null;
    });
  }

  deleteUser(id: string, name: string) {
    this.http.delete(`users/${id}`).subscribe({
      next: (data) => {
        this.rendertable(this.tempUrl, this.pageIndex, this.pageSize);
        this.toasterSuccess(`User: ${name} deleted!`);
      },
    });
  }

  resetTableData(){
    this.table.setData(1,10);
  }


  toasterSuccess(message) {
    this.toastr.success(message);
  }
}

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
