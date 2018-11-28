import { ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

export class SideMenuBase {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  isOpened: boolean = false;
  constructor(
    protected media: MediaMatcher, protected changeDetectorRef: ChangeDetectorRef
  ){
    this.mobileQuery = media.matchMedia('(max-width: 480px)');
    this.isOpened=!this.mobileQuery.matches;
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.mobileQuery.addListener(()=>this.isOpened=!this.mobileQuery.matches);
  }
}
