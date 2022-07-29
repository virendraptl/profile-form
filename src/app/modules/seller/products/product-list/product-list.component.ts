import { Component, OnInit } from '@angular/core';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { ConfirmationDialogComponent } from 'src/app/modules/layout/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  p: number = 1;
  totalData;
  loading: boolean = true;
  empty: boolean = false;
  autoHover = [];

  public productsArr;
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(
    private headerTitleService: HeaderTitleService,
    private http: HttpService,
    public dialog: MatDialog,
    private toasterService: HotToastService
  ) {
    this.headerTitleService.setTitle('Products List');
  }

  ngOnInit(): void {
    this.renderProducts(1, 10);
  }

  renderProducts(page, limit) {
    this.loading = true;
    this.http
      .get('products', { page: page, limit: limit })
      .subscribe((data) => {
        this.totalData = data;
        this.productsArr = [...data['results']];
        if (this.productsArr.length == 0) {
          console.log('no products to show;');
          this.empty = true;
        }
        console.log('Products data:', this.productsArr);
        this.loading = false;
      });
  }

  getDetails(i) {
    console.log(this.productsArr[i]);
  }

  deleteProduct(name, id, i) {
    this.http.delete(`products/${id}`).subscribe({
      next: (data) => {
        // this.toasterService.success(`Product: "${name}" deleted!`);
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');

        this.renderProducts(this.totalData.page, this.totalData.limit);
      },
      error: (err) => {
        this.toasterService.warning('Error: ', err.message);
      },
    });
  }

  openConfirmationDialog(name: string, id: string, i: number) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.confirmMessage = `Are you sure you want to delete this product: ${name} ?`;

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(name, ' Deleted!!!');
        // this.deleteUser(id, name, i);
        this.deleteProduct(name, id, i);
      }
      this.dialogRef = null;
    });
  }

  pageChanged(event) {
    console.log(event);
    this.renderProducts(event, this.totalData.limit);
  }

  sweetDelete(name, id, index) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProduct(name, id, index);

        // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
