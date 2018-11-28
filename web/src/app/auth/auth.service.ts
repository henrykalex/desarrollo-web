import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';
import { LocalStorage } from 'ngx-webstorage';

import { LoginType, TypeFunctions } from '../classes/LoginType';
import { AppConfig } from '../app.config';

const apiUrl = AppConfig.apiURL;

@Injectable()
export class AuthService {

  private _isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isLoggedIn: boolean = false;
  @LocalStorage('token')
  public token: any;
  loginType: string;
  get loginTypeUrl():string{
    return this.loginType=='client'?'':this.loginType+'/';
  }
  isMaster: boolean;
  userName: string;

  public get isLoggedInObsevable(): Observable<boolean>{
    return this._isLoggedInSubject.asObservable();
  }
  public get isLoggedIn(){
    return (this._isLoggedIn && (this.token != undefined));
  }
  public set isLoggedIn(value: boolean){
    this._isLoggedIn = value;
  }

  constructor(private http:HttpClient) {
    this.isMaster = false;
  }

  isLoggedInServer(type:string){
    // console.log("localStorage ",this.token,type);
    if(this.token){
      var isLoggedInUrl = apiUrl+'isLoggedIn/';
      isLoggedInUrl+=(type == LoginType.CLIENT)?'':type;
      return this.http.get(isLoggedInUrl).map((response:any)=>{
        console.log("isLoggedInServer response",response);
        this.userName = response.userName;
        return this.setLoginStatus(response.success,this.token,response.type);
      });
    }else{
      return Observable.from([this.setLoginStatus(false,null,null)]);
    }
  }

  login(userCredentialas: any, type:string){
    var loginUrl = apiUrl+'login/'+type;

    let body = {email:userCredentialas.email,password:userCredentialas.password};
    return this.http.post(loginUrl,body).map((response:any)=>{
      console.log("login response", response);
      this.userName = response.userName;
      // if(type=='veterinary'||type=='distributor')
      // return {success: this.isLoggedIn, type:null};
      return this.setLoginStatus(response.success,response.token,response.type);
    });
  }
  register(userInfo,type): Observable<any>{
    // console.log("userInfo",userInfo)
    var registerUrl = apiUrl+'register/'+type;
    return this.http.post(registerUrl,userInfo).map((response:any)=>{
    // console.log("response s",response);
      this.userName = userInfo.name;
      return this.setLoginStatus(response.success,response.token,response.type);
    });
  }
  logOut(){
    return this.setLoginStatus(false,null,null);
  }

  private setLoginStatus(success,token,type):any{
    // console.log("setLoginStatus",success,token,type)
    this.isLoggedIn = success?true:false;
    this.loginType = (success?type:null);
    // this.isAdmin = (this.loginType == 'master' || this.loginType == LoginType.DISTRIBUTOR);
    this.isMaster = (this.loginType == LoginType.MASTER);
    this.token = token;
    this._isLoggedInSubject.next(this._isLoggedIn);
    // console.log("setLoginStatus end",this.isMaster,this.loginType,this.isLoggedIn)
    return {success: this.isLoggedIn, type:this.loginType};
  }
}
