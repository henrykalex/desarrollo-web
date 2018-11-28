import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';

import { ProductsAddListComponent } from '../../components/products-add-list/products-add-list.component';
import { AuthService } from '../../../auth/auth.service';
import { OrderService } from '../../../services/order.service';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss']
})
export class OrderNewComponent implements OnInit {
  isRequest: boolean;

  orderList: any[];
  providers: any[];
  providersFiltered: any[];
  selectedProvider: string;
  selectProvider: FormControl = new FormControl();

  userType: string;

  totalCost: number;
  totalPoints: number;
  totalRewardPoints: number;
  constructor(
    private authService: AuthService, private orderService: OrderService,
    private activatedRoute:ActivatedRoute, private router:Router,
    private dialogService:DialogService, private matDialog:MatDialog
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data=>{
      this.isRequest = data.type=='request';
    });
    this.userType = this.authService.loginType;
    this.getOrderList();
    if(this.userType=='client'||this.userType=='veterinary')
    this.orderService.getUserProviders().subscribe(providers=>{
      this.providers = providers;
    },error=>{
      console.log("getUserProviders error",error);
      this.dialogService.showErrorMessage("Error obteniendo los proveedores");
    });
    this.selectProvider.valueChanges.subscribe(value=>{
      if(value._id){
        this.selectedProvider = value._id;
      }else{
        this.providersFiltered = this.providers
        .filter((filterValue)=>{
          filterValue = filterValue.toLowerCase();
          return (value)=>{
            return value.name.toLowerCase().includes(filterValue);
          }
        });
        if(value==""){
          this.selectedProvider = null;
        }
      }
    });
  }
  getOrderList(){
    this.orderList = this.orderService.getOrderList();
    this.totalCost = 0;
    this.totalPoints = 0;
    this.totalRewardPoints = 0;
    console.log("orderList",this.orderList);
    this.orderList.forEach((request)=>{
      if(request.isReward){
        this.totalPoints+= request.cost*request.quantity;
      }else{
        this.totalCost+= request.cost*request.quantity;
        this.totalRewardPoints+= request.rewardPoints*request.quantity;
      }
    },0);
  }

  clearList(){
    this.orderService.clearList();
    this.orderList = [];
  }

  displayFn(user?: any) {
    return user ? user.name : undefined;
  }

  sendOrder(){
    let ordersParsed = this.orderList.map(product=>{
      delete product.productName;
      return product;
    });
    this.orderService.sendOrder(ordersParsed,this.selectedProvider)
    .subscribe(success=>{
      console.log("success",success);
      this.router.navigate(['ordenes'],{relativeTo:this.authService.loginType!='client'?this.activatedRoute.parent:null});
    },error=>{
      console.log("sendOrder error",error);
      this.dialogService.showErrorMessage(error.error.message);
    });
  }
  openAddProduct(){
    let dialogRef = this.matDialog.open(ProductsAddListComponent,{
      width:'80vw',
    });
    dialogRef.afterClosed().subscribe(product=>{
      if(product)
      this.orderService.addToOrder(
        product._id,
        product.name,
        product.quantity,
        product.cost,
        product.rewardPoints,
        product.isReward
      );
      this.getOrderList();
    });
  }

}
