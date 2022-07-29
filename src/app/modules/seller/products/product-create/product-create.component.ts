import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit {
  submitted:boolean = false;
  created:boolean = false;
  failed:boolean = false;
  newProdId:string;
  errMessage:string;
  fileName = '';
  photosArr = [];
  totalPhotos: File[] = [];
  productForm: FormGroup;

  constructor(
    private headerTitleService: HeaderTitleService,
    private http: HttpService,
    private fb: FormBuilder
  ) {
    this.headerTitleService.setTitle('Add New Product');
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      prodName: ['', Validators.required],
      prodDesc: ['', Validators.required],
    });
  }

  get prodName() {
    return this.productForm.get('prodName');
  }

  get prodDesc() {
    return this.productForm.get('prodDesc');
  }

  onFileSelected(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      const file: File = event.target.files[i];

      if (file) {
        this.totalPhotos.push(file);
        this.fileName = file.name;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          this.photosArr.push(event.target.result);
        };
      }
    }
  }

  deletePhoto(i){
    console.log('index: ',i);
    this.photosArr.splice(i,1);
    this.totalPhotos.splice(i,1);
  }

  submitProduct() {
    this.submitted = true;
    console.log(this.productForm.value);
    const formData = new FormData();
    formData.append('name', this.productForm.value.prodName);
    formData.append('description', this.productForm.value.prodDesc);
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
