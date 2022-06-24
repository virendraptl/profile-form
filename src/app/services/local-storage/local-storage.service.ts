import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TableDataService } from '../table-data/table-data.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private router: Router, private table: TableDataService) {}

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deletetoken() {
    localStorage.removeItem('token');
  }

  setData(name: string, data: any) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  getData(name: string) {
    return JSON.parse(localStorage.getItem(name));
  }

  deleteData(name: string) {
    localStorage.removeItem(name);
  }

  logout() {
    this.deletetoken();
    this.deleteData('profileData');
    this.table.setData(1,10);
    this.router.navigate(['/auth/login']);
    console.log('opened login pagess after 401 error');
  }
}
