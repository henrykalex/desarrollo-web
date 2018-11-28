import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService } from '../../../services/order.service';
import { RequestService } from '../../../services/request.service';
import { AuthService } from '../../../auth/auth.service';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-orders-requests',
  templateUrl: './orders-requests.component.html',
  styleUrls: ['./orders-requests.component.scss']
})
export class OrdersRequestsComponent implements OnInit {
  tableFunction: any;
  tableAproveFunction: any;
  columns: any[];

  displayType: string;
  resetTable:boolean;
  constructor(
    private activatedRoute:ActivatedRoute, private orderService:OrderService,
    private authService: AuthService, private router:Router,
    private requestService:RequestService, private dialogService:DialogService
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data=>{
      console.log("data",data);
      this.displayType = data.type;
      if(this.displayType=="order"){
        this.tableFunction = this.orderService.getOrdersByPageFunction;
      }else{
        this.tableFunction = this.requestService.getRequestsByPageFunction;
        this.tableAproveFunction = this.requestService.getRequestsAproveByPageFunction;
      }
    });
    this.columns = [
      {name:'Fecha', key: 'date', pipe: 'date'},
      {name: 'Nombre', key: 'userName'}
    ];
    if(this.displayType=="order")
    this.columns.push({status: 'Status',key: 'status',map: { incomplete :'Sin aprobar',complete:'Aprobada'}});
  }

  viewOrder(order){
    this.router.navigate([this.displayType=='order'?'orden':'pedido',order._id],{relativeTo:this.authService.loginType!='client'?this.activatedRoute.parent:null});
  }

  orderAprove(order){
    this.requestService.aproveOrder(order._id).subscribe(success=>{
      console.log("success",success);
      this.resetTable = true;
      this.dialogService.showMessage('Aprobado','Se aprobó corectamente el pedido.');
    },error=>{
      console.log("error",error);
      let message = error.error?error.error.message:error.message;
      if(message)
      this.dialogService.showErrorMessage(message);
    });
  }

}
