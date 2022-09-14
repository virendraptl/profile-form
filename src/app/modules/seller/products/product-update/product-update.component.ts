import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css'],
})
export class ProductUpdateComponent implements OnInit {
  updateForm: FormGroup;
  loading: boolean = true;
  currentId: string;
  currentData: any;
  tempurl: string;
  photosArr = [];
  prevPhotos = [];
  newPhotos = [];
  imgFlag = [[], []];
  fileName = '';
  previousCount: number;
  finalCount = 0;
  countError = false;

  isSubmitted: boolean = false;
  isUpdated: boolean = false;
  public files: any[] = [];
  public newFile: any;
  uploadFileName: any;
  uploadFileType: any;
  uploadFileContent: any;
  url = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private activatedRoute: ActivatedRoute,
    private headerTitleService: HeaderTitleService,
    private toasterService: HotToastService,
    public previousRouteService: PreviousRouteService,

    private router: Router
  ) {
    this.headerTitleService.setTitle('Update Product Info');
  }

  ngOnInit(): void {
    this.currentId = this.activatedRoute.snapshot.paramMap.get('id');
    this.tempurl = `products/${this.currentId}`;
    console.log('User id for preload req: ', this.currentId);
    this.http.get(this.tempurl).subscribe({
      next: (data) => {
        this.loading = false;
        this.currentData = data;
        this.prevPhotos = [...data['images']];
        console.log('Prev photos:', this.prevPhotos);
        this.createForm();
        this.updateImgFlag();
        this.previousRouteService.setDefPrevUrl(
          `/seller/products/details/${this.currentData._id}`
        );

        console.log(this.currentData);
      },
    });
  }

  createForm() {
    this.updateForm = this.fb.group({
      name: [this.currentData.name, Validators.required],
      description: [this.currentData.description, Validators.required],
      price: [this.currentData.price, Validators.required],
    });
  }

  updateImgFlag() {
    this.previousCount = this.currentData.images.length;
    for (let i = 0; i < this.currentData.images.length; i++) {
      this.imgFlag[0].push(false);
    }
  }

  get name() {
    return this.updateForm.get('name');
  }
  get description() {
    return this.updateForm.get('description');
  }

  get price() {
    return this.updateForm.get('price');
  }

  onFileSelected(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      const file: File = event.target.files[i];

      if (file) {
        this.newPhotos.push(file);
        this.fileName = file.name;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          // console.log('from file input');
          this.photosArr.push(event.target.result);
          this.imgFlag[1].push(false);
        };
      }
    }
    console.log('New photos:', this.newPhotos);
  }

  async fromDropper(data: File[]) {
    this.files = Object.keys(data).map((key) => data[key]);
    this.files.forEach((newFile) => {
      this.newPhotos.push(newFile);
      this.fileName = newFile.name;
      if (this.uploadFileType == 'text/plain') {
        this.uploadFileContent = newFile.text();
      }
      let reader = new FileReader();

      reader.readAsDataURL(newFile);
      reader.onload = (event) => {
        this.photosArr.push(event.target.result);
        this.imgFlag[1].push(false);
      };
    });

    console.log('New photos:', this.newPhotos);
  }

  photoUpdate() {
    let photopass = false;
    const formData = new FormData();
    this.imgFlag[0].forEach((flag, i) => {
      if (flag == true) {
        photopass = true;
        console.log(this.prevPhotos[i].public_id);
        formData.append('delete', this.prevPhotos[i].public_id);
      }
    });
    this.imgFlag[1].forEach((flag, i) => {
      if (flag == false) {
        photopass = true;
        console.log('new photo:', this.newPhotos[i].name);
        formData.append('new_images', this.newPhotos[i]);
      }
    });
    if (photopass) {
      this.http.patch(`products/images/${this.currentId}`, formData).subscribe({
        next: (data) => {
          console.log('Product images update done!!');
          this.toasterService.success('Product update done!!');
          // this.isUpdated = true;
          this.router.navigate([`/seller/products/details/${this.currentId}`]);
        },
        error: (err) => {
          this.isSubmitted = false;
          this.toasterService.error(`Error: ${err.message}`);
        },
      });
    } else {
      this.toasterService.success('Product update done!!');
      this.router.navigate([`/seller/products/details/${this.currentId}`]);
    }
  }

  productUpdate() {

    console.log('description:', this.updateForm.value.description);

    this.imgFlag[0].forEach((flag) => {
      if (flag == true) {
        this.finalCount++;
      }
    });
    this.imgFlag[1].forEach((flag) => {
      if (flag == true) {
        this.finalCount++;
      }
    });
    if (this.finalCount == this.imgFlag[0].length + this.imgFlag[1].length) {
      this.toasterService.error('Product needs at least 1 image');
      this.finalCount = 0;
    } else {
      this.isSubmitted = true;

      this.http
        .patch(`products/${this.currentId}`, this.updateForm.value)
        .subscribe({
          next: (data) => {
            console.log('details updated!');
            this.photoUpdate();
            // this.toasterService.success('P');
          },
          error: (err) => {
            this.toasterService.error(`Error: ${err.message}`);
          },
        });
    }
  }

  resetData() {
    this.photosArr = [];
    this.prevPhotos = [...this.currentData['images']];
    this.newPhotos = [];
    this.imgFlag = [[], []];
    this.createForm();
    this.updateImgFlag();
  }
}
