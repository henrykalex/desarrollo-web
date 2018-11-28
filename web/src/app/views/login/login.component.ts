import { Component, OnInit } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';

import { LoginQuestions } from '../../questions/login';

import { AuthService } from '../../auth/auth.service';
import { WindowRefService } from '../../services/window-ref.service';

import { LoginType } from '../../classes/LoginType';
import { AppConfig } from '../../app.config';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginQuestions: any[] = LoginQuestions;
  loginType: string;

  isLoading:boolean;
  errorMessage: string;

  windowRef: Window;
  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute, private authService:AuthService,
    private windowRefService:WindowRefService
  ) { }

  ngOnInit() {
    this.windowRef = this.windowRefService.nativeWindow;
    this.activatedRoute.paramMap.subscribe((params:ParamMap)=>{
      let urlType = params.get("type");

      if(!AppConfig.isProduction)
      this.loginType =
      urlType == 'master'?'master':
      urlType == 'distribuidor'?'distributor':
      urlType == 'veterinario'?'veterinary':
      '';
      if(AppConfig.isProduction){
        let hostname = this.windowRef.location.hostname;
        let subdomain = hostname.split('.')[0];
        console.log("subdomain",subdomain);
        if(!subdomain)
        this.windowRef.location.href = AppConfig.redirectUrl;
        this.loginType =
        subdomain == 'admin'?'master':
        subdomain == 'distribuidor'?'distributor':
        subdomain == 'veterinario'?'veterinary':
        subdomain == 'cliente'?'':null;
        console.log("loginType",this.loginType);
        if(this.loginType === null)
        this.windowRef.location.href = AppConfig.redirectUrl;
      }
      if(!this.loginType)
      this.router.navigate(['iniciar']);
    });



    this.authService.logOut();
  }

  login(event){
    // console.log("event",event);
    this.isLoading = true;
    this.authService.login(event,this.loginType).subscribe((response:any)=>{
      if(response.success){
        this.isLoading = false;
        response.type==LoginType.CLIENT?
        this.router.navigate(['perfil']):
        response.type==LoginType.MASTER?
        this.router.navigate(['admin']):
        response.type==LoginType.DISTRIBUTOR?
        this.router.navigate(['distribuidor']):
        response.type==LoginType.VETERINARY?
        this.router.navigate(['veterinario']):
        null;
      }else{
        this.processError({status: -1});
      }
    },error=>{
      console.log("error",error);
      this.processError(error);
    });
  }

  processError(error){
    this.isLoading = false;
    this.errorMessage =
    error.status == 0 || error.status >= 500?
    "Error de servidor":
    error.status == -1?
    "Error del cliente":
    error.status >= 400 && error.status < 500?
    error.error.message:
    "Error";
  }

}
