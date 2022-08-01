import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-prod-details',
  templateUrl: './prod-details.component.html',
  styleUrls: ['./prod-details.component.css'],
})
export class ProdDetailsComponent implements OnInit {
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

  isSubmitted: boolean = false;
  isUpdated: boolean = false;

  sliderOptions: any;

  constructor(
    private http: HttpService,
    private activatedRoute: ActivatedRoute,
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

  openFullScreenView(previewUrl) {
    // this.selectedImageIndex = this.fullviewArr.indexOf(previewUrl);
    this.showFlag = true;
  }

  closeFullScreenView() {
    this.showFlag = false;
    this.selectedImageIndex = -1;
  }
}
