import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../../auth/auth.service';
import { OrderService } from '../../../services/order.service';
import { RequestService } from '../../../services/request.service';
import { DialogService } from '../../../services/dialog.service';
import {categoryMap} from '../../../classes/categoryMap';

const OrderQuestions = [
  {label: "FECHA", key:"date", pipe:'date'},
  {label: "TOTAL", key:"total", pipe: 'currency'},
  {label: "ESTATUS", key:"status"},
];

@Component({
  selector: 'app-order-request-view',
  templateUrl: './order-request-view.component.html',
  styleUrls: ['./order-request-view.component.scss']
})
export class OrderRequestViewComponent implements OnInit {
  displayType: string;
  userProviderRegex: RegExp = /(master|distributor|veterinary)/;
  orderId: string;
  orderValues: any;
  orderQuestions: any[] = OrderQuestions;

  loginType: string;

  orderProductsSubject: Subject<any> = new Subject<any>();
  orderProductsTableFunction: ()=>Observable<any>;
  columns: any[];
  constructor(
    private orderService:OrderService, private activatedRoute: ActivatedRoute,
    private authService:AuthService, private router:Router,
    private requestService:RequestService, private dialogService:DialogService
  ) {
    this.columns = [
      {name:'Nombre', key: 'name'},
      {name:'Código', key: 'productCode'},
      {name:'Categoría', key: 'category', map: categoryMap},
      {name:'Cantidad', key: 'quantity'},
    ];
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data=>{
      console.log("data",data);
      this.displayType = data.type;
    });
    this.loginType = this.authService.loginType;
    this.orderProductsTableFunction = (options?):Observable<any>=>{
      return this.orderProductsSubject.asObservable()
      .map((orderProducts:any)=>{
        console.log("orderProducts",orderProducts);
        let productsMap =  orderProducts.items.map(orderProduct=>{
          let product = orderProduct.productId;
          product.productId = product._id;
          // product._id = orderProduct._id;
          product.quantity = orderProduct.quantity;
          return product;
        });
        return {items:productsMap};
      });
    }
    this.activatedRoute.paramMap.subscribe((paramMap:ParamMap)=>{
      let orderId = paramMap.get('id');
      console.log("orderId",orderId);
      this.orderId = orderId;
      this.getOrderData();
    });
  }

  getOrderData(){
    this.orderService.getOrder(this.orderId).subscribe((orderData:any)=>{
      if(orderData)
      this.orderValues = orderData;
      console.log("this.orderValues",this.orderValues);
      this.orderProductsSubject.next({items:this.orderValues.products});
    });
  }
  viewOrderProduct(product){
    console.log("product",product);
    this.router.navigate(['producto',product.productId],{relativeTo:this.authService.loginType!='client'?this.activatedRoute.parent:null});
  }

  openUserModel(userModel, userId){
    // console.log("userModel",userModel,userId);
    let urlRoute;
    urlRoute=this.authService.isMaster?[userModel, userId]:['ver',userModel, userId];
    // console.log("urlRoute",urlRoute);
    this.router.navigate(urlRoute,{relativeTo:this.authService.loginType!='client'?this.activatedRoute.parent:null});
  }
  orderAprove(){
    console.log("orderAprove");
    this.dialogService.showLoading();
    this.requestService.aproveOrder(this.orderId)
    .subscribe(success=>{
      this.dialogService.hideLoading();
      console.log("success",success);
      if(success){
        this.dialogService.showMessage('Aprobado','Se aprobó corectamente el pedido.');
        this.orderValues.status = 'complete';
        this.orderValues=Object.assign({},this.orderValues);
      }
    },error=>{
      this.dialogService.hideLoading();
      console.log("error",error);
      let message = error.error?error.error.message:error.message;
      if(message)
      this.dialogService.showErrorMessage(message);
    });
  }

}
