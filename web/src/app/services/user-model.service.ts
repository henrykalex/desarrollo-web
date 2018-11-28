import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
// import 'rxjs/observable/from';

import { AppConfig } from '../app.config';
const apiUrl = AppConfig.apiURL;

import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserModelService {

  constructor(
    private http:HttpClient, private authService: AuthService
  ) { }

  getUserModelByPageFunction = (type:string, request?: boolean)=>{
    let query = new HttpParams().set('request',request?"true":"false");
    return (options): Observable<any>=>{
      // console.log("options",options);
      query = options.page?query.append('page',options.page+''):query.delete('page');
      return this.http.get(apiUrl+'master/users/'+type,{params:query}).map((response: any)=>{
        return {items:response.items, totalCount:response.count};
      }, error=>{
        console.log("error",error);
        return false;
      });
    }
  }

  createUserModel(userType, userData){
    return this.http.post(apiUrl+'master/user/'+userType,userData).map((response: any)=>{
      return response.item;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  getUserModel(userType, userId, isMaster){
    // console.log("getUserModel",userType, userId, isMaster)
    return this.http.get(apiUrl+(isMaster?'master/':this.authService.loginTypeUrl)+'user/'+userType+'/'+userId).map((response: any)=>{
      // console.log("getUserModel response",response);
      return response.item;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  getUserProfile(){
    let currentUserType = this.authService.loginTypeUrl;
    return this.http.get(apiUrl+currentUserType+'profile').map((response: any)=>{
      // console.log("response",response);
      return response.item;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  getProductsInventoryReward = (userType?, userId?)=>{
    return (options): Observable<any>=>{
      // console.log("this.authService.isMaster",this.authService.isMaster,userType, userId);
      let url =
      this.authService.isMaster?
      `${apiUrl}master/products/${userType}/${userId}/inventory/rewards`:
      `${apiUrl}${this.authService.loginTypeUrl}products/inventory/rewards`;
      let newParams = new HttpParams();
      newParams = options.page?newParams.append('page',options.page+''):newParams;
      return this.http.get(url,{params:newParams}).map((response: any)=>{
        // console.log("response",response);
        return {items:response.items,totalCount:response.count};
      }, error=>{
        console.log("error",error);
        return false;
      });
    }
  }

  aprove(userId,userType){
    let currentUserType = this.authService.loginTypeUrl;
    return this.http.get(`${apiUrl}${currentUserType}user/aprove/${userType}/${userId}`)
    .map((response: any)=>{
      // console.log("response",response);
      return response.success;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  updateUserModel(userData, userId,userType){
    return this.http.patch(`${apiUrl}master/user/${userType}/${userId}`,userData)
    .map((response: any)=>{
      // console.log("response",response);
      return response.item;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }
  updateUserProfile(userData){
    let currentUserType = this.authService.loginTypeUrl;
    return this.http.patch(`${apiUrl}${currentUserType}profile`,userData)
    .map((response: any)=>{
      // console.log("response",response);
      return response.item;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  deleteUserModel(userId,userType){
    return this.http.delete(`${apiUrl}master/user/${userType}/${userId}`)
    .map((response: any)=>{
      // console.log("response",response);
      return response.success;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

}
