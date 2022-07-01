import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  currentId: string;
  currentData: any;
  loading: boolean;

  constructor(
    private http: HttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private headerTitleService: HeaderTitleService
  ) {
        this.headerTitleService.setTitle('Profile');

  }

  ngOnInit(): void {

    this.loading = true;
    this.currentId = this.activatedRoute.snapshot.paramMap.get('id');
    this.http.get(`users/${this.currentId}`).subscribe({
      next: (data) => {
        this.currentData = data;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        // this.location.back();
      },
    });
  }
}

// activated_route
// https://www.samjulien.com/how-to-use-route-parameters-in-angular
