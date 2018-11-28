import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class AppConfig {
  public static isProduction = environment.production;
  public static apiURL: string = environment.apiURL;
  public static redirectUrl: string = environment.redirectUrl;
  constructor(){
  }
}
