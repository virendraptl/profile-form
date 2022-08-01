import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ConfirmationDialogComponent } from 'src/app/modules/layout/confirmation-dialog/confirmation-dialog.component';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  loading: boolean;
  productId: string;
  productData: any;
  productImages: any;
  fullviewArr = [];
  showFlag: boolean = false;
  selectedImageIndex: number = -1;

  previewUrl = '';
  uploadDate;
  updateDate;
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  isSubmitted:boolean = false;
  isUpdated:boolean = false;

  sliderOptions: any;

  constructor(
    private http: HttpService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private toasterService: HotToastService,
    private headerTitleService: HeaderTitleService,
    private router: Router
  ) {
    this.headerTitleService.setTitle('Products Details');
  }

  ngOnInit(): void {
    this.loading = true;
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.http.get(`products/${this.productId}`).subscribe({
      next: (data) => {
        this.loading = false;
        this.productData = data;
        this.productImages = data['images'];
        this.productImages.forEach((img) => {
          this.fullviewArr.push({ image: img.url });
        });
        this.previewUrl = this.productImages[0].url;
        this.uploadDate = new Date(this.productData.createdAt);
        this.updateDate = new Date(this.productData.updatedAt);
        console.log('Product details:', this.productData);
        console.log('Product images:', this.productImages);
      },
      error: (err) => {
        console.log('Error: ', err);
      },
    });
  }

  imgClicked(i) {
    this.selectedImageIndex = i;
    this.previewUrl = this.productImages[i].url;
    // console.log('img clicked............');
  }

  openConfirmationDialog(name: string, id: string) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.confirmMessage = `Are you sure you want to delete this product: ${name} ?`;

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(name, ' Deleted!!!');
        // this.deleteUser(id, name, i);
        this.deleteProduct(name, id);
      }
      this.dialogRef = null;
    });
  }

  deleteProduct(name, id) {
    this.http.delete(`products/${id}`).subscribe({
      next: (data) => {
        this.toasterService.success(`Product: "${name}" deleted!`);
        this.router.navigate(['/seller/products']);
      },
      error: (err) => {
        this.toasterService.warning('Error: ', err.message);
      },
    });
  }

  openFullScreenView(previewUrl) {
    // this.selectedImageIndex = this.fullviewArr.indexOf(previewUrl);
    this.showFlag = true;
  }

  closeFullScreenView() {
    this.showFlag = false;
    this.selectedImageIndex = -1;
  }

  sweetDelete(name, id) {
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
        this.deleteProduct(name, id);

        // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}

// carousel http://ivylab.space/carousel/demo
// https://github.com/ivylaboratory/angular-carousel

// extra: https://lukasz-galka.github.io/ngx-gallery-demo/
// extra: http://kenwheeler.github.io/slick/

// fullscreen preview: https://www.npmjs.com/package/ng-image-fullscreen-view