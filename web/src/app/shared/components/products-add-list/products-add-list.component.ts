import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginType, TypeFunctions } from '../../../classes/LoginType';

import { QuantitySelectDialogComponent } from '../../../shared/components/quantity-select-dialog/quantity-select-dialog.component';

import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../auth/auth.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {categoryMap} from '../../../classes/categoryMap';

@Component({
  selector: 'app-products-add-list',
  templateUrl: './products-add-list.component.html',
  styleUrls: ['./products-add-list.component.scss']
})
export class ProductsAddListComponent implements OnInit {
  tableFunction: any;
  tableRewardFunction: any;
  columns: any[];

  constructor(
    private activatedRoute:ActivatedRoute, private productService:ProductService,
    private authService: AuthService, private router:Router,
    private matDialogRef:MatDialogRef<ProductsAddListComponent>, @Inject(MAT_DIALOG_DATA) data:any,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.columns = [
      {name:'Nombre', key: 'name'},
      {name:'Bandera', key: 'category', map:categoryMap},
    ];
    this.tableFunction = this.productService.getProductsByPageFunction;
    this.tableRewardFunction = this.productService.getRewardProductsByPageFunction;
  }

  // viewProduct(product){
  //   console.log("product",product);
  // }
  viewProduct(product){
    let dialogRef = this.dialog.open(QuantitySelectDialogComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      if(!result)
      return;
      this.matDialogRef.close({
        _id: product._id,
        name: product.name,
        quantity: result,
        cost: product.isReward?product.points:product.cost,
        rewardPoints: product.isReward?null:product.points,
        isReward: product.isReward
      })
      // let quantity = result;
      // let serviceFunction = toRequest?this.requestService.addToRequest:
      // this.orderService.addToOrder;
      // serviceFunction(
      //   this.productId,this.productValues.name,quantity,
      //   this.productValues.isReward?this.productValues.points:this.productValues.cost,
      //   this.productValues.isReward?null:this.productValues.points,
      //   this.productValues.isReward
      // );
      // if(!toRequest)
      // this.isInList = result?true:false;
      // if(toRequest)
      // this.isInRequestList = result?true:false;

    });
  }

}
