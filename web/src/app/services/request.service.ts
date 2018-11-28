import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LocalStorage } from 'ngx-webstorage';

import { AppConfig } from '../app.config';
const apiUrl = AppConfig.apiURL;

import { AuthService } from '../auth/auth.service';

@Injectable()
export class RequestService {
  @LocalStorage()
  public requestList: any[] = [];

  constructor(
    private http:HttpClient,private authService:AuthService
  ) {
    console.log("constructor",this.requestList);
  }
  parseListItems(items){
    console.log("parseListItems req")
    return items.map(item=>{
      console.log("item",item.userType);
      if(item.userType=='client'){
        item.userName = item.userId.name;
      }
      if(item.userType=='veterinary'){
        item.userName = item.veterinaryId.name;
      }
      if(item.userType=='distributor')
      item.userName = item.distributorId.name;

      // if(item.userId)
      // item.userName = item.userId.name;
      // if(item.veterinaryId)
      // item.userName = item.veterinaryId.name;
      // if(item.distributorId)
      // item.userName = item.distributorId.name;
      return item;
    });
  }

  getRequestsByPageFunction = (options): Observable<any>=>{
    let newParams = new HttpParams();
    newParams = options.page?newParams.append('page',options.page+''):newParams;
    return this.http.get(apiUrl+this.authService.loginTypeUrl+'requests',{params:newParams}).map((response: any)=>{
      console.log("getRequestsByPageFunction",response);
      response.items = this.parseListItems(response.items);
      return {items:response.items, totalCount:response.count};
    }, error=>{
      console.log("error",error);
      return false;
    });
  }
  getRequestsAproveByPageFunction = (options): Observable<any>=>{
    let newParams = new HttpParams();
    newParams = options.page?newParams.append('page',options.page+''):newParams;
    return this.http.get(apiUrl+this.authService.loginTypeUrl+'requests/aprove',{params:newParams}).map((response: any)=>{
      console.log("getRequestsAproveByPageFunction",response);
      response.items = this.parseListItems(response.items);
      return {items:response.items, totalCount:response.count};
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  isInList(productId){
    if(!this.requestList)
    return false;
    let productIndex = this.requestList.findIndex(product=>product.productId==productId);
    return productIndex!=-1;
  }

  addToRequest = (productId,productName, quantity, cost,rewardPoints, isReward?)=>{
    if(!this.requestList)
    this.requestList = [];
    this.requestList.push({
      productId:productId,
      productName:productName,
      quantity:quantity,cost:cost,
      isReward:isReward,
      rewardPoints:rewardPoints
    });
    this.requestList = this.requestList;
    console.log("addToRequest",this.requestList);
  }

  getRequestList(){
    return this.requestList;
  }

  removeFromRequest(productId){
    let productIndex = this.requestList.findIndex(product=>product.productId==productId);
    this.requestList.splice(productIndex,1);
    this.requestList = this.requestList;
  }

  clearList(){
    this.requestList = [];
  }

  sendRequest(requestList,buyerId?){
    let body = {requestList:requestList,buyerId:buyerId};
    return this.http.post(`${apiUrl}${this.authService.loginTypeUrl}request`,body).map((response: any)=>{
      this.clearList();
      return response.success;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  getRequest(requestId){
    return this.http.get(`${apiUrl}${this.authService.loginTypeUrl}request/${requestId}`).map((response: any)=>{
      console.log("response",response);
      return response.item;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  getUserBuyers(){
    return this.http.get(`${apiUrl}${this.authService.loginTypeUrl}request/buyers`).map((response: any)=>{
      console.log("response",response);
      return response.items;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  aproveOrder(orderId){
    let currentUserType = this.authService.loginTypeUrl;
    return this.http.get(`${apiUrl}${currentUserType}request/${orderId}/aprove`)
    .map((response: any)=>{
      console.log("response",response);
      return response.success;
    });
  }

}
