import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AppConfig } from '../app.config';
const apiUrl = AppConfig.apiURL;

import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProductService {

  constructor(
    private http:HttpClient,private authService:AuthService
  ) { }

  getProductsByPageFunction = (options): Observable<any>=>{
    console.log("options",options);
    let newParams = new HttpParams();
    newParams = options.page?newParams.append('page',options.page+''):newParams;
    return this.http.get(apiUrl+this.authService.loginTypeUrl+'products',{params:newParams}).map((response: any)=>{
      return {items:response.items, totalCount:response.count};
    }, error=>{
      console.log("error",error);
      return false;
    });
  }
  getRewardProductsByPageFunction = (options): Observable<any>=>{
    let params = new HttpParams().set('reward',"true");
    params = options.page?params.append('page',options.page+''):params;
    return this.http.get(apiUrl+this.authService.loginTypeUrl+'products',{params:params}).map((response: any)=>{
      return {items:response.items, totalCount:response.count};
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  createProduct(productData){
    return this.http.post(apiUrl+'master/product',productData).map((response: any)=>{
      return response.item;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  getProduct(productId){
    return this.http.get(apiUrl+this.authService.loginTypeUrl+'product/'+productId).map((response: any)=>{
      console.log("response",response);
      return response.item;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  updateProduct(productData, productId){
    return this.http.patch(`${apiUrl}master/product/${productId}`,productData)
    .map((response: any)=>{
      console.log("response",response);
      return response.item;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  deleteProduct(productId){
    return this.http.delete(`${apiUrl}master/product/${productId}`)
    .map((response: any)=>{
      console.log("response",response);
      return response.success;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  getProductInventory(productId){
    return this.http.get(`${apiUrl}${this.authService.loginTypeUrl}product/${productId}/inventory`).map((response: any)=>{
      console.log("response",response);
      return response.quantity;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  updateInventory(productId,value){
    return this.http.patch(`${apiUrl}master/product/${productId}/inventory`,{quantity:value})
    .map((response: any)=>{
      console.log("response",response);
      return response.item;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  getProductOrders = (productId, userType)=>{
    return (options)=>{
      let newParams = new HttpParams();
      newParams = options.page?newParams.append('page',options.page+''):newParams;
      return this.http.get(`${apiUrl}master/product/${productId}/orders/${userType}`,{params:newParams})
      .map((response: any)=>{
        console.log("response",response);
        return {items:response.items,totalCount:response.count};
      }, error=>{
        console.log("error",error);
        return false;
      });
    }
  }

}
