import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/dialog/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

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
  pageIndex: number = 1;
  pageSize: number;
  tempUrl: string;
  loadFlag: boolean = true;

  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(
    private http: HttpService,
    public dialog: MatDialog,
    private router: Router,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.tempUrl = 'users';
    this.rendertable(this.tempUrl);
  }

  getDetails(id) {
    console.log('id is -', id);
    this.storage.setData('currentId', id);
    this.storage.setData('pageIndex', this.pageIndex);
    this.router.navigate(['/users/details']);
  }

  rendertable(url) {
    this.loadFlag = true;
    // console.log('URL is - ', url);
    this.http.get(url).subscribe({
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
    // console.log(
    //   'Current page no. is: ',
    //   this.pageIndex,
    //   'Page index: ',
    //   this.pageIndex,
    //   'Page size: ',
    //   this.pageSize
    // );
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
        this.deleteUser(id);
      }
      this.dialogRef = null;
    });
  }

  deleteUser(id: string) {
    this.http.delete(`users/${id}`).subscribe({
      next: (data) => {
        this.rendertable(this.tempUrl);
      },
    });
  }
}

// Angular material dialog component
// --------------------------------------
// https://stackoverflow.com/questions/41684114/easy-way-to-make-a-confirmation-dialog-in-angular
