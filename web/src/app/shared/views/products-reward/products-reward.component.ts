import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginType, TypeFunctions } from '../../../classes/LoginType';

import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-products-reward',
  templateUrl: './products-reward.component.html',
  styleUrls: ['./products-reward.component.scss']
})
export class ProductsRewardComponent implements OnInit {
  tableRewardFunction: any;
  columns: any[];

  constructor(
    private activatedRoute:ActivatedRoute, private productService:ProductService,
    private authService: AuthService, private router:Router
  ) { }

  ngOnInit() {
    this.columns = [
      {name:'Nombre', key: 'name'},
      {name:'Puntos', key: 'points', pipe:'points'},
    ];
    this.tableRewardFunction = this.productService.getRewardProductsByPageFunction;
  }

  viewProduct(product){
    this.router.navigate(['producto',product._id],{relativeTo:this.authService.loginType!='client'?this.activatedRoute.parent:null});
  }

}
