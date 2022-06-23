import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/dialog/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { TableDataService } from 'src/app/services/table-data/table-data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'role',
    'org',
    'status',
    'edit',
    'button',
  ];
  dataSource = [];
  tempdata: any;
  pageIndex: number;
  pageSize: number;
  tempUrl: string;
  loadFlag: boolean = true;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(
    private http: HttpService,
    public dialog: MatDialog,
    private router: Router,
    private storage: LocalStorageService,
    private table: TableDataService,
    private snackBar: MatSnackBar,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    [this.pageIndex, this.pageSize] = this.table.getData();
    // console.log(this.pageIndex, this.pageSize);
    this.tempUrl = `users?page=${this.pageIndex}&&limit=${this.pageSize}`;
    this.rendertable(this.tempUrl);
  }

  getDetails(id) {
    console.log('id is -', id);
    this.router.navigate([`/users/details/${id}`]);
  }

  rendertable(url) {
    this.loadFlag = true;
    // console.log('URL is - ', url);
    this.http.get(url).subscribe({
      // this.http.get2('users', ['page',this.pageIndex, 'limit', this.pageSize]).subscribe({
      next: (data) => {
        this.tempdata = data;
        this.dataSource = data['results'];
        // console.log(this.dataSource);
        this.loadFlag = false;
      },
    });
  }

  changeTable(e: PageEvent) {
    // console.log('paginator event: ', e);
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.table.setData(this.pageIndex, this.pageSize);
    this.tempUrl = `users?page=${this.pageIndex}&&limit=${this.pageSize}`;
    // console.log(this.tempUrl);
    this.rendertable(this.tempUrl);
  }

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
        this.rendertable(this.tempUrl);
        this.showSuccess(`User: ${name} deleted!`);
      },
    });
  }

  updateDetails(id: string) {
    console.log('id is -', id);
    this.router.navigate([`/users/update/${id}`]);
  }

  showSuccess(message) {
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
