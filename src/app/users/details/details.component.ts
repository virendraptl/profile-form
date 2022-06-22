import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  currentId: string;
  currentData: any;
  loading:boolean;

  constructor(
    private storage: LocalStorageService,
    private http: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.currentId = this.storage.getData('currentId');
    console.log('Details page user id: ', this.currentId);
    this.http.get(`users/${this.currentId}`).subscribe({
      next: (data) => {
        this.currentData = data;
        console.log('Details page data: ', this.currentData);
        this.loading = false;
      },
    });
  }


}
