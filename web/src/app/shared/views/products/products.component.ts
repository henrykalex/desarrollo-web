import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginType, TypeFunctions } from '../../../classes/LoginType';

import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  tableFunction: any;
  columns: any[];

  constructor(
    private activatedRoute:ActivatedRoute, private productService:ProductService,
    private authService: AuthService, private router:Router
  ) { }

  ngOnInit() {
    this.columns = [
      {name:'Nombre', key: 'name'},
      {name:'Bandera', key: 'flag'},
    ];
    this.tableFunction = this.productService.getProductsByPageFunction;
  }

  viewProduct(product){
    this.router.navigate(['producto',product._id],{relativeTo:this.authService.loginType!='client'?this.activatedRoute.parent:null});
  }

}
