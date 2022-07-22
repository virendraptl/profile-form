import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';

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

  sliderOptions: any;

  constructor(
    private http: HttpService,
    private activatedRoute: ActivatedRoute,
    private headerTitleService: HeaderTitleService
  ) {
    this.headerTitleService.setTitle('Product Details');
    this.sliderOptions = {
      animation: {
        animationClass: 'transition', // done
        animationTime: 500,
      },
      swipe: {
        swipeable: true, // done
        swipeVelocity: 0.004, // done - check amount
      },
      drag: {
        draggable: true, // done
        dragMany: true, // todo
      },
      autoplay: {
        enabled: true,
        direction: 'right',
        delay: 5000,
        stopOnHover: true,
        speed: 6000,
      },
      arrows: true,
      infinite: true,
      breakpoints: [
        {
          width: 768,
          number: 1,
        },
        {
          width: 991,
          number: 3,
        },
        {
          width: 9999,
          number: 4,
        },
      ],
    };
  }

  ngOnInit(): void {
    this.loading = true;
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.http.get(`products/${this.productId}`).subscribe({
      next: (data) => {
        this.loading = false;
        this.productData = data;
        this.productImages = data['images'];
        console.log('Product details:', this.productData);
        console.log('Product images:', this.productImages);
      },
      error: (err) => {
        console.log('Error: ', err);
      },
    });
  }
}
