import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  pageIndexSize = [1, 10];
  loggedUser = '';
  searchTerm = '';
  rxjsData = new BehaviorSubject({ page: 1, limit: 10 });
  prodSearchTerm: string = '';

  constructor() {}

  setData(index: number, size: number) {
    this.pageIndexSize[0] = index;
    this.pageIndexSize[1] = size;
  }

  getData() {
    return this.pageIndexSize;
  }

  setSearch(term: string) {
    this.searchTerm = term;
  }

  getSearch() {
    return this.searchTerm;
  }

  setRxjs(data) {
    this.rxjsData.next({ page: data.page, limit: data.limit });
  }

  setProdSearchTerm(term) {
    this.prodSearchTerm = term;
  }

  getProdSearchTerm(){
    return this.prodSearchTerm;
  }
}
