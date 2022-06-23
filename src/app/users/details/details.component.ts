import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { Location } from '@angular/common';

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
    private storage: LocalStorageService,
    private http: HttpService,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    // this.currentId = this.storage.getData('currentId');
    this.currentId = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log('Details page user id: ', this.currentId);
    this.http.get(`users/${this.currentId}`).subscribe({
      next: (data) => {
        this.currentData = data;
        // console.log('Details page data: ', this.currentData);
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        // this.location.back();
        this.router.navigate(['/users']);
      },
    });
  }

  locationback() {
    this.router.navigate(['/users']);
  }

  updateDetails(){
    // console.log('id is -', this.currentId);
    this.router.navigate([`/users/update/${this.currentId}`]);
  }
}

// activated_route
// https://www.samjulien.com/how-to-use-route-parameters-in-angular