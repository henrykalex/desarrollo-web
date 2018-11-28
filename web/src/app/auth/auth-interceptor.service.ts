// ref https://medium.com/@milosbejda/adding-authorization-header-to-http-request-in-angular-4-and-5-777b2ce05424
// ref: https://medium.com/@ryanchenkie_40935/angular-authentication-using-the-http-client-and-http-interceptors-2f9d1540eb8

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../app.config';

import { AuthService } from './auth.service';

const whiteList = [
  'isLoggedIn',
  'isLoggedIn\/(master|distributor|veterinary|)',
  '(master\/|distributor\/veterinary\/|)profile',
  '(master\/|distributor\/|veterinary\/|)(users|user)\/(distributor|veterinary|client)',
  'master\/user\/(distributor|veterinary|client)',
  '(master\/|distributor\/|veterinary\/|)user\/(distributor|veterinary|client)\/[0-9a-zA-Z]{0,25}',
  'master\/user\/aprove\/(distributor|veterinary)\/[0-9a-zA-Z]{0,25}',
  '(master\/|distributor\/|veterinary\/|)(distributor|veterinary|client)',
  'master\/product',
  'master\/product\/[0-9a-zA-Z]{0,25}',
  'master\/product\/[0-9a-zA-Z]{0,25}\/(image|feeding-chart-image)',
  '(master\/|distributor\/|veterinary\/|)product\/[0-9a-zA-Z]{0,25}(|\/inventory)',
  '(master\/|distributor\/|veterinary\/|client\/|)(products\/)(distributor\/|veterinary\/|client\/|)([0-9a-zA-Z]{0,25}|)(\/inventory\/rewards)',
  '(master\/|distributor\/|veterinary\/|)product\/[0-9a-zA-Z]{0,25}(|\/orders).*',
  '(master\/|distributor\/|veterinary\/|)products',
  '(master\/|distributor\/|veterinary\/|)(link|unlink)\/(distributor|veterinary|client)',
  '(master\/|distributor\/|veterinary\/|)linked\/(distributor|veterinary|client).*',
  '(master\/|distributor\/|veterinary\/|)profile',
  '(master\/|distributor\/|veterinary\/|)(order|orders|request|requests)(|\/[0-9a-zA-Z]{0,25}|.*)(|\/aprove)',
  '(master\/|distributor\/|veterinary\/|)stats(\/static|\/users|\/products|\/products\/sold|\/download|)',

];
const apiUrl = AppConfig.apiURL;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService:AuthService){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("AuthInterceptor",req.url);
    if (whiteList.findIndex(value=>{
      // console.log("req.url",req.url,value);
      let temp = req.url.match('^'+apiUrl+value+'$');
      // console.log("temp",temp);
      return temp?temp.length>0:false;
    }) !== -1) {
      var token = this.authService.token;
      console.log("token",token)
      let headers = {
        'Accept'       : 'application/json',
        'Authorization': `Bearer ${token}`,
      };
      if(!req.url.match('image'))
      headers['Content-Type'] = 'application/json; charset=utf-8';
      req = req.clone({
        setHeaders: headers,
      });
      return next.handle(req);
    } else {
      return next.handle(req);
    }
  }
}
