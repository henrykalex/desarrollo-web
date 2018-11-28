import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorIntlEs } from './table-labels.provider';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [{provide: MatPaginatorIntl, useClass: MatPaginatorIntlEs}]
})
export class TableComponent implements OnInit {
  dataSource = new MatTableDataSource();

  _source: any[];
  @Input()
  set source(value: any[]){
    console.log("Input source",value);
    this._source = value;
    this.resultsLength = this.source.length;
    this.dataSource.data = this.source;
  }
  get source(): any[]{
    return this._source;
  }
  _sourceFunction: (options:{
    // sort?: string;
    // order?: string;
    page: number;
  })=>Observable<{items: any[],totalCount:number}>;

  @Input() set sourceFunction(value: (options:{
    // sort?: string;
    // order?: string;
    page: number;
  })=>Observable<{items: any[],totalCount:number}>){
    this._sourceFunction = value;
    console.log("this._sourceFunction",this._sourceFunction);
    if(this.dataSource){ // Data need to resync
      console.log("this.dataSource",this.dataSource);
      this.sourceFunction({page:0}).subscribe(data=>{
        console.log("data",data);
        this.dataSource.data = data.items;
        this.resultsLength = data.totalCount;
      })
    }
  }

  get sourceFunction():(options:{
    // sort?: string;
    // order?: string;
    page: number;
  })=>Observable<{items: any[],totalCount:number}>{
    return this._sourceFunction;
  }


  _columns: any[];
  @Input()
  set columns(value: any[]){
    this._columns = value;
    if(this.columns){
      console.log("concating",this.displayedColumns);
      this.displayedColumns = this.displayedColumns.concat(this.columns.map(value=>value.key));
    }
  }
  get columns(){
    return this._columns;
  }
  @Input() viewLabel: string = 'VER';
  @Output() onItemClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onItemDelete: EventEmitter<any> = new EventEmitter<any>();

  displayedColumns: string[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isError = false;
  @Input() set viewButton(value: boolean){
    console.log("value",value,);
    if(value){
      this.displayedColumns.splice(this.displayedColumns.length,0,'view');
    }
    console.log("this.displayedColumns",this.displayedColumns);
  }
  @Input() deleteText: string = 'ELIMINAR';
  @Input() set deleteButton(value: boolean){
    console.log("value",value,);
    if(value){
    this.displayedColumns.splice(this.displayedColumns.length-1,0,'delete');
    }
    console.log("this.displayedColumns",this.displayedColumns);
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  @Input() set reset(value: boolean){
    if(value)
    this.reloadData();
  }
  constructor() { }

  ngOnInit() {
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // merge(this.sort.sortChange, this.paginator.page)
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          console.log("change detacted")
          return this.sourceFunction?this.sourceFunction(
            {
              // sort: this.sort.active,
              // order: this.sort.direction,
              page: this.paginator.pageIndex
            }):Observable.from([{
              items:this.source?this.source:[],
              totalCount:this.resultsLength?this.resultsLength:0
            }]);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isError = false;
          this.resultsLength = data.totalCount;

          return data.items;
        }),
        catchError(error=> {
          console.log("error",error);
          this.isLoadingResults = false;
          this.isError = true;
          return observableOf([]);
        })
      ).subscribe(data => {
        console.log("data",data);
        this.dataSource.data = data});
  }

  reloadData(){
    if(this.sourceFunction)
    this.sourceFunction({
      // sort: this.sort.active,
      // order: this.sort.direction,
      page: this.paginator.pageIndex
    }).subscribe(data => {
      console.log("data",data);
      this.isLoadingResults = false;
      this.isError = false;
      this.resultsLength = data.totalCount;
      this.dataSource.data = data.items});
  }

}
