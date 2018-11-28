import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LocalStorage } from 'ngx-webstorage';

import { AppConfig } from '../app.config';
const apiUrl = AppConfig.apiURL;

import { AuthService } from '../auth/auth.service';

@Injectable()
export class OrderService {
  @LocalStorage()
  public orderList: any[] = [];

  constructor(
    private http:HttpClient,private authService:AuthService
  ) {
    // console.log("constructor");
  }

  parseListItems(items){
    console.log("parseListItems");
    return items.map(item=>{
      if(item.userType=='client'){
        item.userName = item.veterinaryId.name;
      }
      if(item.userType=='veterinary'){
        item.userName = item.distributorId.name;
      }
      if(item.userType=='distributor')
      item.userName = 'Administrador';
      // if(item.userId)
      // item.userName = item.userId.name;
      // if(item.veterinaryId)
      // item.userName = item.veterinaryId.name;
      // if(item.distributorId)
      // item.userName = item.distributorId.name;
      return item;
    });
  }

  getOrdersByPageFunction = (options): Observable<any>=>{
    let newParams = new HttpParams();
    newParams = options.page?newParams.append('page',options.page+''):newParams;
    return this.http.get(apiUrl+this.authService.loginTypeUrl+'orders',{params:newParams}).map((response: any)=>{
      response.items = this.parseListItems(response.items);
      console.log("response.items",response.items);
      return {items:response.items, totalCount:response.count};
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  getUserOrdersByPageFunction = (userType, userId)=>{
    // console.log("userType, userId",userType, userId);
    return (options): Observable<any>=>{
      let newParams = new HttpParams();
      newParams = options.page?newParams.append('page',options.page+''):newParams;
      return this.http.get(`${apiUrl}master/orders/${userType}/${userId}`,{params:newParams})
      .map((response: any)=>{
        console.log("getUserOrdersByPageFunction",response);
        response.items = this.parseListItems(response.items);
        return {items:response.items, totalCount:response.count};
      }, error=>{
        console.log("error",error);
        return false;
      });
    }
  }

  isInList(productId){
    let productIndex = this.orderList.findIndex(product=>product.productId==productId);
    return productIndex!=-1;
  }

  addToOrder = (productId,productName, quantity, cost,rewardPoints, isReward?)=>{
    if(!this.orderList)
    this.orderList = [];
    this.orderList.push({
      productId:productId,
      productName:productName,
      quantity:quantity,cost:cost,
      isReward:isReward,
      rewardPoints:rewardPoints
    });
    this.orderList = this.orderList;
    console.log("addToOrder",this.orderList);
  }

  getOrderList(){
    return this.orderList;
  }

  removeFromOrder(productId){
    let productIndex = this.orderList.findIndex(product=>product.productId==productId);
    this.orderList.splice(productIndex,1);
    this.orderList = this.orderList;
  }

  clearList(){
    this.orderList = [];
  }

  sendOrder(orderList,providerId?){
    let body = {orderList:orderList,providerId:providerId};
    return this.http.post(`${apiUrl}${this.authService.loginTypeUrl}order`,body).map((response: any)=>{
      this.clearList();
      return response.success;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  getOrder(orderId){
    return this.http.get(`${apiUrl}${this.authService.loginTypeUrl}order/${orderId}`).map((response: any)=>{
      console.log("response",response);
      return response.item;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  getUserProviders(){
    return this.http.get(`${apiUrl}${this.authService.loginTypeUrl}order/providers`).map((response: any)=>{
      console.log("response",response);
      return response.items;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

}
