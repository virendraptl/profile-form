import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  pageIndexSize = [1, 10];
  searchTerm = '';
  rxjsData = new BehaviorSubject({page: 1, limit: 10});
  // rxjsData = new Subject();

  constructor(){
    // this.rxjsData.next({ page: 1, limit: 10 });
  }

  setData(index: number, size: number) {
    this.pageIndexSize[0] = index;
    this.pageIndexSize[1] = size;
    // console.log(this.pageIndexSize);
  }

  getData() {
    return this.pageIndexSize;
  }

  setSearch(term:string){
    console.log('term is service: ',term);
    this.searchTerm = term;
  }

  getSearch(){
    return this.searchTerm;
  }

  setRxjs(data){
    this.rxjsData.next({page: data.page, limit: data.limit})
  }
}
