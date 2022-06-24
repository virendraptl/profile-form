import { Injectable } from '@angular/core';
import { Observable, observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  pageIndexSize = [1, 10];
  pageDataSub = new Subject<{index:number, size:number}>();

  constructor() {
    this.pageDataSub.next({index:1, size:10});
  }

  setData(index: number, size: number) {
    this.pageIndexSize[0] = index;
    this.pageIndexSize[1] = size;
    // console.log(this.pageIndexSize);
  }

  getData() {
    return this.pageIndexSize;
  }

  setSub(data) {
    console.log('setting rxjs subject');
    this.pageDataSub.next({index: data.index, size: data.size});
  }

  getSub() {
    console.log('getting rxjs subject');
    return this.pageDataSub.asObservable();
  }
}
