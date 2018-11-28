import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/from';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad{

  constructor(private authService: AuthService, private router: Router) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let url: string = state.url;
    console.log("canActivate url",route.parent.url);
    return this.checkLogin(route.parent.url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): Observable<boolean> {
    let type = route.path;
    console.log("canLoad type",type);
    return this.checkLogin(type);
  }

  checkLogin(type): Observable<boolean> {
    console.log("checkLogin",type);
    if(type=='admin')
    type = 'master';
    if(type=='tienda')
    type = 'veterinary';
    if(type=='distribuidor')
    type = 'distributor';
    return this.authService.isLoggedInServer(type)
    .map((res:any)=>{
      console.log("checkLogin",res);
      if(!res.success) this.router.navigate(['iniciar',type=='admin'?'master':type]);
      return res.success;
    }).catch((error,caught)=>{
      console.log("error",error);
      this.router.navigate(['iniciar',type=='admin'?'master':type]);
      return Observable.from([false]);
    });
  }

}
