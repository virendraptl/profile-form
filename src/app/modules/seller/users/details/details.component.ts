import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { HttpService } from 'src/app/services/http/http.service';
import { PreviousRouteService } from 'src/app/services/previous-route/previous-route.service';

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
    private activatedRoute: ActivatedRoute,
    public previousRouteService: PreviousRouteService,

    private headerTitleService: HeaderTitleService
  ) {
    this.headerTitleService.setTitle('User Details');
  }

  ngOnInit(): void {
        this.previousRouteService.setDefPrevUrl('/seller/users');

    // console.log(this.previousRouteService.getPreviousUrl());
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
