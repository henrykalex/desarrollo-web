import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import { Subject } from 'rxjs';

import { AppConfig } from '../../../app.config';
const apiUrl = AppConfig.apiURL;

import { ProductQuestions } from '../../../questions/product';
import { ProductRewardQuestions } from '../../../questions/product-reward';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../auth/auth.service';
import { OrderService } from '../../../services/order.service';
import { RequestService } from '../../../services/request.service';
import { DialogService } from '../../../services/dialog.service';

import { ProductAddComponentDialog } from '../../../admin/views/product-add/product-add.component';
import { ImageDialogComponent } from '../../../shared/components/image-dialog/image-dialog.component';
import { QuantitySelectDialogComponent } from '../../../shared/components/quantity-select-dialog/quantity-select-dialog.component';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {
  productQuestions: any[] = ProductQuestions;
  productId: string;
  productValues: any;

  productImageUrl: string = apiUrl+'product-images/';
  tableImageUrl: string = apiUrl+'feeding-chart-images/';

  productInventory: number;
  inventoryChangeSubject: Subject<number> = new Subject<number>();
  isInList: boolean;
  isInRequestList: boolean;

  isProvider: boolean;

  distributorsOrdersTableFunction: any;
  veterinariesOrdersTableFunction: any;
  clientsOrdersTableFunction: any;
  columns: any[];

  sectorMap: any = { small:'RAZA PEQUEÑA',size:'RAZA MEDIANA & GRANDE',all:'TODAS LAS RAZAS',client:'CLIENTE FINAL'}
  constructor(
    private productService: ProductService, private activatedRoute: ActivatedRoute,
    private authService: AuthService, private dialog: MatDialog,
    private orderService: OrderService, private requestService:RequestService,
    private router:Router, private dialogService:DialogService
  ) {
    this.columns = [
      {name:'Fecha', key: 'date', pipe:'date'},
      {name:'Total', key: 'total', pipe: 'currency'},
    ];
  }

  ngOnInit() {
    // this.activatedRoute.data.subscribe(data=>{
    //   console.log("data",data);
    //   this.userDisplayType = data.type;
    //   this.userModelQuestions =
    //   this.userDisplayType == 'distributor'?DistributorQuestions:
    //   this.userDisplayType == 'veterinary'?VeterinaryQuestions:
    //   this.userDisplayType == 'client'?ClientQuestions:
    //   null;
    // });
    let userType = this.authService.loginType;
    this.isProvider = userType=='veterinary'||userType=='distributor'||userType=='master';
    this.activatedRoute.paramMap.subscribe((paramMap:ParamMap)=>{
      let productId = paramMap.get('id');
      console.log("productId",productId);
      this.productId = productId;
      this.getProductData();
      if(productId && this.authService.isMaster)
      this.setHistoryLinks(productId);
    });
    this.subscribeInventory();
  }

  setHistoryLinks(productId){
    this.distributorsOrdersTableFunction = this.productService.getProductOrders(productId, 'distributor');
    this.veterinariesOrdersTableFunction = this.productService.getProductOrders(productId, 'veterinary');
    this.clientsOrdersTableFunction = this.productService.getProductOrders(productId, 'client');
  }

  subscribeInventory(){
    let tempValue;
    this.inventoryChangeSubject
    .debounceTime(300)
    .switchMap(value=>{
      tempValue = value;
      return this.productService.updateInventory(this.productId,value);
    }).subscribe(response=>{
      console.log("response",response);
      this.productInventory = tempValue;
    },error=>{
      console.log("error",error);
    });
  }
  getProductData(){
    this.productService.getProduct(this.productId).subscribe((productData:any)=>{
      if(productData)
      this.productValues = productData;
      console.log("this.productValues",this.productValues);
      if(!this.authService.isMaster){
        // if(!this.isProvider)
        this.isInList= this.orderService.isInList(this.productId);
        if(this.isProvider)
        this.isInRequestList= this.requestService.isInList(this.productId);
      }
      if(this.productValues)
      if(this.productValues.isReward){
        this.productQuestions = ProductRewardQuestions;
      }
      this.productService.getProductInventory(this.productId).subscribe((productQuantity:any)=>{
        if(productQuantity)
        this.productInventory = productQuantity;
        console.log("this.productInventory",this.productInventory);
      });
    });

  }

  openUpdateProduct(){
    let dialogRef = this.dialog.open(ProductAddComponentDialog, {
      width: '650px',
      data: { product: this.productValues },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      this.productValues = result;
      this.dialogService.showMessage("Actualizado","Se ha actualizado correctamente.");
    });
  }

  openImage(field, isProduct){
    let imageUrl = (isProduct?this.productImageUrl:this.tableImageUrl)+this.productValues[field];
    let dialogRef = this.dialog.open(ImageDialogComponent, {
      // width: '650px',
      data: { imageUrl: imageUrl}
    });
  }

  inventoryChange(value){
    console.log("inventoryChange",value);
    this.inventoryChangeSubject.next(value);
  }

  openAddProduct(toRequest){
    let dialogRef = this.dialog.open(QuantitySelectDialogComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      if(!result)
      return;
      let quantity = result;
      let serviceFunction = toRequest?this.requestService.addToRequest:
      this.orderService.addToOrder;
      serviceFunction(
        this.productId,this.productValues.name,quantity,
        this.productValues.isReward?this.productValues.points:this.productValues.cost,
        this.productValues.isReward?null:this.productValues.points,
        this.productValues.isReward
      );
      if(!toRequest)
      this.isInList = result?true:false;
      if(toRequest)
      this.isInRequestList = result?true:false;
    });
  }

  deleteProduct(){
    this.productService.deleteProduct(this.productId).subscribe((success)=>{
      if(success){
        this.dialogService.showMessage('Eliminado','Se ha eliminado corractemente.');
        this.router.navigate([this.productValues.isReward?'productos-recompensa':'productos'],{relativeTo:this.authService.loginType!='client'?this.activatedRoute.parent:null});
      }
    });
  }

  removeFromList(fromRequest){
    if(!fromRequest){
      this.orderService.removeFromOrder(this.productId);
      this.isInList = false;
    }
    if(fromRequest){
      this.requestService.removeFromRequest(this.productId);
      this.isInRequestList = false;
    }
  }

  viewProductOrder(order){
    this.router.navigate(['pedido',order._id],{relativeTo:this.activatedRoute.parent});
  }
}
