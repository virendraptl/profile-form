import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  pageIndexSize = [1,10]

  constructor() { }

  setData(index:number, size:number){
    this.pageIndexSize[0] = index;
    this.pageIndexSize[1] = size;
    // console.log(this.pageIndexSize);
  }

  getData(){
    return this.pageIndexSize;
  }

}
