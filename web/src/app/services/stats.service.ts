import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LocalStorage } from 'ngx-webstorage';

import { AppConfig } from '../app.config';
const apiUrl = AppConfig.apiURL;

import { AuthService } from '../auth/auth.service';
import { WindowRefService } from '../services/window-ref.service';

@Injectable()
export class StatsService {
  @LocalStorage()
  public orderList: any[];

  constructor(
    private http:HttpClient,private authService:AuthService,
    private windowRefService:WindowRefService
  ) { }

  getStaticStats(){
    return this.http.get(`${apiUrl}${this.authService.loginTypeUrl}stats/static`)
    .map((response: any)=>{
      return response.item;
    });
  }
  getDynamicStats(options){
    let params = new HttpParams();
    if(options.distributorId)
    params = params.append('distributor', options.distributorId);
    if(options.veterinaryId)
    params = params.append('veterinary', options.veterinaryId);
    if(options.clientId)
    params = params.append('client', options.clientId);
    if(options.productId)
    params = params.append('product', options.productId);
    if(options.dateStart)
    params = params.append('start', options.dateStart);
    if(options.dateEnd)
    params = params.append('end', options.dateEnd);

    return this.http.get(`${apiUrl}${this.authService.loginTypeUrl}stats`,{params:params})
    .map((response: any)=>{
      console.log("getDynamicStats",response);
      return response.item;
    });
  }

  getUsersList(userType,userId?){
    let params = new HttpParams().set('type',userType);
    if(userId)
    params = params.append('userid',userId);
    return this.http.get(`${apiUrl}${this.authService.loginTypeUrl}stats/users`,{params:params})
    .map((response: any)=>{
      console.log("getUsersList",response);
      return response.items;
    });
  }
  getProductList(){
    return this.http.get(`${apiUrl}${this.authService.loginTypeUrl}stats/products`,)
    .map((response: any)=>{
      console.log("getProductList",response);
      return response.items;
    });
  }

  getMostSoldProductsFunction = (isReward: boolean)=>{
    return (): Observable<any>=>{
      let params = new HttpParams().set('reward',""+isReward);
      return this.http.get(`${apiUrl}master/stats/products/sold`,{params:params}).map((response: any)=>{
        return {items:response.items};
      }, error=>{
        console.log("error",error);
        return false;
      });
    }
  }

  downloadStats(){
    return this.http.get(`${apiUrl}${this.authService.loginTypeUrl}stats/download`,{
      responseType: "blob",
      observe: 'response'
    })
    .map((response: any)=>{
      console.log("downloadStats",response);
      let _navigator = this.windowRefService.nativeWindow.navigator;
      let isChrome = _navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
      let isSafari = _navigator.userAgent.toLowerCase().indexOf('safari') > -1;
      (isChrome|| isSafari)?this.downloadStatsFileClick(response.body):
      this.downloadStatsFile(response);
      return true;
    });
  }
  downloadStatsFileClick(data:Response){
    let blob = new Blob([data], { type: 'text/csv' });
    let url= this.windowRefService.nativeWindow.URL.createObjectURL(blob);
    var element = this.windowRefService.nativeWindow.document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', 'mascotte-stats.csv');
    element.style.display = 'none';
    this.windowRefService.nativeWindow.document.body.appendChild(element);
    element.click();
    this.windowRefService.nativeWindow.document.body.removeChild(element);
  }
  downloadStatsFile(data: Response){
    console.log("downloadStatsFile");
    // Does not works on safari or chrome:
    let blob = new Blob([data.body], { type: 'text/csv' });
    let url= this.windowRefService.nativeWindow.URL.createObjectURL(blob);
    this.windowRefService.nativeWindow.open(url,'Download');
  }
}
