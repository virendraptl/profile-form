import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit {
  submitted: boolean = false;
  created: boolean = false;
  failed: boolean = false;
  newProdId: string;
  errMessage: string;
  fileName = '';
  photosArr = [];
  totalPhotos: File[] = [];
  productForm: FormGroup;
  files: any[];
  newPhotos = [];
  uploadFileType: string;
  uploadFileContent: any;
  imgFlag: any;
  code = '';
  // code =
  //   '<ol><li><em>this is the test description for </em>…e need to check how it can be rendered.</li></ol>';

  constructor(
    private headerTitleService: HeaderTitleService,
    private http: HttpService,
    public previousRouteService: PreviousRouteService,

    private fb: FormBuilder
  ) {
    this.headerTitleService.setTitle('Add New Product');
  }

  ngOnInit(): void {
    this.previousRouteService.setDefPrevUrl('/seller/products');

    this.productForm = this.fb.group({
      prodName: ['', Validators.required],
      prodDesc: [this.code, Validators.required],
      price: ['', Validators.required],
    });
  }

  get prodName() {
    return this.productForm.get('prodName');
  }

  get prodDesc() {
    return this.productForm.get('prodDesc');
  }

  get price() {
    return this.productForm.get('price');
  }

  onFileSelected(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      const file: File = event.target.files[i];

      if (file) {
        this.totalPhotos.push(file);
        this.fileName = file.name;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        // reader.readAsBinaryString()
        reader.onload = (event) => {
          this.photosArr.push(event.target.result);
        };
      }
    }
  }

  async fromDropper(data: File[]) {
    this.files = Object.keys(data).map((key) => data[key]);
    this.files.forEach((newFile) => {
      this.totalPhotos.push(newFile);
      this.fileName = newFile.name;
      if (this.uploadFileType == 'text/plain') {
        this.uploadFileContent = newFile.text();
      }
      let reader = new FileReader();

      reader.readAsDataURL(newFile);
      reader.onload = (event) => {
        this.photosArr.push(event.target.result);
      };
    });

    console.log('New photos:', this.newPhotos);
  }

  deletePhoto(i) {
    console.log('index: ', i);
    this.photosArr.splice(i, 1);
    this.totalPhotos.splice(i, 1);
  }

  submitProduct() {
    this.submitted = true;
    console.log(this.productForm.value);
    const formData = new FormData();
    formData.append('name', this.productForm.value.prodName);
    formData.append('description', this.productForm.value.prodDesc);
    formData.append('price', this.productForm.value.price);
    for (let i = 0; i < this.totalPhotos.length; i++) {
      formData.append('images', this.totalPhotos[i]);
    }
    this.http.post('products', formData).subscribe({
      next: (data) => {
        console.log('Product uploaded successfully!!!');
        this.created = true;
        this.newProdId = data['_id'];
      },
      error: (err) => {
        console.log('Error... ', err.message);
        this.errMessage = err.message;
      },
    });
  }
}

// rich text quill editor
// https://www.freakyjolly.com/angular-rich-text-editor-using-ngx-quill-tutorial/
// instead of modifying angular.json, update index.html with following:
// <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
// <link href="https://cdn.quilljs.com/1.3.6/quill.bubble.css" rel="stylesheet">
