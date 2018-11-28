import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AppConfig } from '../app.config';
const apiUrl = AppConfig.apiURL;

import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserLinkService {

  constructor(private http:HttpClient, private authService:AuthService) { }

  linkUser(linkUserType,linkUserCode, linkToUserType?,linkToUserId?){
    // console.log("linkUser",linkUserType,linkUserCode, linkToUserType,linkToUserId);
    let currentUserType = this.authService.loginType
    currentUserType = currentUserType=='client'?'':currentUserType+'/';
    // console.log("currentUserType",currentUserType);
    let body = {
      linkUserCode: linkUserCode,
      linkToUserType: linkToUserType,
      linkToUserId: linkToUserId,
    };
    return this.http.post(apiUrl+currentUserType+'link/'+linkUserType,body)
    .map((response: any)=>{
      return response.success;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

  getLinkedUsersFunction = (linkedUserType, linkedToUserType?,linkedToUserId?)=>{
    // console.log("linkUser",linkedUserType, linkedToUserType,linkedToUserId);
    let currentUserType = this.authService.loginType;
    // console.log("currentUserType",currentUserType);
    currentUserType = currentUserType=='client'?'':currentUserType+'/';
    // console.log("currentUserType",currentUserType);
    let query: any = {
      linkedToUserType: linkedToUserType,
      linkedToUserId: linkedToUserId,
    };
    return (options): Observable<any>=>{
      if(options.page)query.page = options.page+'';

      return this.http.get(apiUrl+currentUserType+'linked/'+linkedUserType,{params:query})
      .map((response: any)=>{
        // console.log("response",response);
        return {items:response.items,totalCount:response.count};
      }, error=>{
        console.log("error",error);
        return false;
      });
    }
  }

  unlinkUser(unlinkUserType,unlinkUserId , unlinkFromUserType?,unlinkFromUserId?){
    // console.log("unlinkUser",unlinkUserType,unlinkUserId, unlinkFromUserType,unlinkFromUserId);
    let currentUserType = this.authService.loginType
    currentUserType = currentUserType=='client'?'':currentUserType+'/';
    // console.log("currentUserType",currentUserType);
    let body = {
      unlinkUserId: unlinkUserId,
      unlinkFromUserType: unlinkFromUserType,
      unlinkFromUserId: unlinkFromUserId,
    };
    return this.http.patch(`${apiUrl}${currentUserType}unlink/${unlinkUserType}`,body)
    .map((response: any)=>{
      return response.success;
    }, error=>{
      console.log("error",error);
      return false;
    });
  }

}
