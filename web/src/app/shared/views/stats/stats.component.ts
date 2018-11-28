import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StatsService } from '../../../services/stats.service';
import { AuthService } from '../../../auth/auth.service';
import { DialogService } from '../../../services/dialog.service';

import { AppConfig } from '../../../app.config';
const apiUrl = AppConfig.apiURL;

export interface StatsOptions{
  distributorId?;
  veterinaryId?;
  clientId?;
  productId?;
  dateStart?;
  dateEnd?;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  apiUrl: any = apiUrl;
  dateControll: FormGroup;

  filterControll: FormGroup;

  staticStats: any;
  dynamicStats: any;

  distributors: any[];
  distributorsFiltered: any[];
  veterinaries: any[];
  veterinariesFiltered: any[];
  clients: any[];
  clientsFiltered: any[];
  products: any[];
  productsFiltered: any[];

  userType: string;

  productsSoldTableFunction: any;
  productsRewardSoldTableFunction: any;
  columns: any[];

  isLoading: boolean;
  constructor(
    private statsService:StatsService, private authService:AuthService,
    private router:Router, private activatedRoute:ActivatedRoute,
    private dialogService:DialogService
  ) {
    this.dateControll = new FormGroup({
      dateStart: new FormControl(''),
      dateEnd: new FormControl(''),
    });

    this.filterControll = new FormGroup({
      distributorSelect: new FormControl(''),
      veterinarySelect: new FormControl(''),
      clientSelect: new FormControl(''),
      productSelect: new FormControl(''),
    });
    this.columns = [
      {name:'Nombre', key: 'productName'},
      {name:'Cantidad', key: 'count'},
    ];
    this.productsSoldTableFunction = this.statsService.getMostSoldProductsFunction(false);
    this.productsRewardSoldTableFunction = this.statsService.getMostSoldProductsFunction(true);
  }

  ngOnInit() {
    this.userType = this.authService.loginType;

    this.getStaticStats();
    this.getDynamicStats();
    // console.log("stats ngOnInit",this.authService.loginType);
    if(this.userType=='master')
    this.getUsersList('distributor');
    if(this.userType=='distributor')
    this.getUsersList('veterinary');
    if(this.userType=='veterinary')
    this.getUsersList('client');

    this.subscribeToSelects();
    this.getProductList();
  }

  filterSelect(filterValue){
    filterValue = filterValue.toLowerCase();
    return (value)=>{
      return value.name.toLowerCase().includes(filterValue);
    }
  }



  onUserSelectorChange(event, userType){

  }

  onProductSelectorChange(event){

  }

  displayFn(user?: any) {
    return user ? user.name : undefined;
  }

  getStaticStats(){
    this.statsService.getStaticStats().subscribe(stats=>{
      this.staticStats = stats;
    },error=>{
      console.log("error",error);
    });
  }

  getUsersList(userType, userId?){
    this.statsService.getUsersList(userType, userId).subscribe(users=>{
      if(userType=='distributor'){
        this.distributors = users;
        this.distributorsFiltered = this.distributors;
      }
      if(userType=='veterinary'){
        this.veterinaries = users;
        this.veterinariesFiltered = this.veterinaries;
      }
      if(userType=='client'){
        this.clients = users;
        this.clientsFiltered = this.clients;
      }

    },error=>{
      console.log("getUsersList error",error);
    });
  }
  getProductList(){
    this.statsService.getProductList().subscribe(products=>{
      this.products = products;
      this.productsFiltered = this.products;
    },error=>{
      console.log("getProductList error",error);
    });
  }
  getFiltervalues(){
    return {
      distributorId: this.filterControll.get('distributorSelect').value["_id"],
      veterinaryId: this.filterControll.get('veterinarySelect').value["_id"],
      clientId: this.filterControll.get('clientSelect').value["_id"],
      productId: this.filterControll.get('productSelect').value["_id"],
      dateStart: this.dateControll.get('dateStart').value,
      dateEnd: this.dateControll.get('dateEnd').value
    };
  }
  getDynamicStats(){
    let options: StatsOptions = this.getFiltervalues();
    this.statsService.getDynamicStats(options).subscribe(stats=>{
      this.dynamicStats = stats;
    },error=>{
      console.log("getStats error",error);
    });
  }

  subscribeToSelects(){
    let subscribeFunction = (filtered,original,getUser?)=>{
      return values=>{
        // console.log("filterControll valueChanges",values);
        if(values._id){
        this.getDynamicStats();
          if(getUser){
            this.getUsersList(getUser,values._id);
          }
        }else{
          this[filtered] = this[original]
          .filter(this.filterSelect(values));
          if(values==""){
            this.getDynamicStats();
          }
        }
      }
    }
    if(this.userType == 'master')
    this.filterControll.get("distributorSelect").valueChanges
    .subscribe(subscribeFunction('distributorsFiltered','distributors','veterinary'));

    if(this.userType == 'master' || this.userType == 'distributor')
    this.filterControll.get("veterinarySelect").valueChanges
    .subscribe(subscribeFunction('veterinariesFiltered','veterinaries','client'));

    if(this.userType == 'master' || this.userType == 'veterinary')
    this.filterControll.get("clientSelect").valueChanges
    .subscribe(subscribeFunction('clientsFiltered','clients'));

    this.filterControll.get("productSelect")
    .valueChanges.subscribe(subscribeFunction('productsFiltered','products'));

  }

  viewProduct(product){
    this.router.navigate(['producto',product._id],{relativeTo:this.activatedRoute.parent});
  }

  downloadStats(){
    this.dialogService.showMessage('Descargando','En breve comenzará tu descarga.');
    this.isLoading = true;
    this.statsService.downloadStats().subscribe(success=>{
      this.isLoading = false;
      // if(success)
      // this.dialogService.showMessage('Descargando','Descarga comenzada');
    },error=>{
      console.log("error",error);
      this.dialogService.showErrorMessage('Error en la descarga pruebe más tarde.');
    });
  }

}
