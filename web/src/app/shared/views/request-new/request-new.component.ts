import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';

import { ProductsAddListComponent } from '../../components/products-add-list/products-add-list.component';
import { AuthService } from '../../../auth/auth.service';
import { RequestService } from '../../../services/request.service';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-request-new',
  templateUrl: './request-new.component.html',
  styleUrls: ['./request-new.component.scss']
})
export class RequestNewComponent implements OnInit {
  isRequest: boolean;

  requestList: any[];
  buyers: any[];
  buyersFiltered: any[];
  selectedBuyer: string;
  selectBuyer: FormControl = new FormControl();

  userType: string;

  totalCost: number;
  totalPoints: number;
  totalRewardPoints: number;
  constructor(
    private authService: AuthService, private requestService: RequestService,
    private activatedRoute:ActivatedRoute, private router:Router,
    private dialogService:DialogService, private matDialog:MatDialog
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data=>{
      this.isRequest = data.type=='request';
    });
    this.userType = this.authService.loginType;
    this.getRequestList();
    if(this.userType=='master'||this.userType=='distributor'||this.userType=='veterinary')
    this.requestService.getUserBuyers().subscribe(buyers=>{
      this.buyers = buyers;
    },error=>{
      console.log("getUserBuyers error",error);
    });
    this.selectBuyer.valueChanges.subscribe(value=>{
      if(value._id){
        this.selectedBuyer = value._id;
      }else{
        this.buyersFiltered = this.buyers
        .filter((filterValue)=>{
          filterValue = filterValue.toLowerCase();
          return (value)=>{
            return value.name.toLowerCase().includes(filterValue);
          }
        });
        if(value==""){
          this.selectedBuyer = null;
        }
      }
    });
  }
  getRequestList(){
    this.requestList = this.requestService.getRequestList();
    console.log("this.requestList",this.requestList);
    this.totalCost = 0;
    this.totalPoints = 0;
    this.totalRewardPoints = 0;
    this.requestList.forEach((request)=>{
      if(request.isReward){
        this.totalPoints+= request.cost*request.quantity;
      }else{
        this.totalCost+= request.cost*request.quantity;
        this.totalRewardPoints+= request.rewardPoints*request.quantity;
      }
    },0);
  }
  clearList(){
    this.requestService.clearList();
    this.requestList = [];
  }

  displayFn(user?: any) {
    return user ? user.name : undefined;
  }

  sendRequest(){
    let requestsParsed = this.requestList.map(product=>{
      delete product.productName;
      return product;
    });
    this.requestService.sendRequest(requestsParsed,this.selectedBuyer)
    .subscribe(success=>{
      console.log("success",success);
      this.router.navigate(['pedidos'],{relativeTo:this.authService.loginType!='client'?this.activatedRoute.parent:null});
    },error=>{
      console.log("sendRequest error",error);
      this.dialogService.showErrorMessage(error.error.message);
    });
  }
  openAddProduct(){
    let dialogRef = this.matDialog.open(ProductsAddListComponent,{
      width:'80vw',
    });
    dialogRef.afterClosed().subscribe(product=>{
      if(product)
      this.requestService.addToRequest(
        product._id,
        product.name,
        product.quantity,
        product.cost,
        product.rewardPoints,
        product.isReward
      );
      this.getRequestList();
    });
  }

}
