import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'role', 'org', 'status'];
  dataSource = [];
  data: any;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.http.get('users').subscribe({
      next: (data) => {
        this.data = data;
        this.dataSource = data['results'];
        console.log(this.dataSource);
      },
    });
  }

  getDetails(id) {
    console.log('id is -', id);
  }

  changeTable(e: PageEvent){
    console.log('paginator event: ',e);
  };
}
