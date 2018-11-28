import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { WindowRefService } from '../../../services/window-ref.service';

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss']
})
export class LocationSelectorComponent implements OnInit {
  _longitude: Number;
  @Input() set longitude(value: Number){
      this._longitude = value;
      this.longitudeChange.emit(this._longitude);
  }
  get longitude(): Number{
    return this._longitude;
  }
  @Output() longitudeChange: EventEmitter<Number> = new EventEmitter<number>();


  _latitude: Number;
  @Input() set latitude(value: Number){
      this._latitude = value;
      this.latitudeChange.emit(this._latitude);
  }
  get latitude(): Number{
    return this._latitude;
  }
  @Output() latitudeChange: EventEmitter<Number> = new EventEmitter<number>();

  navigatorRef: Navigator;
  startLongitude: Number;
  startLatitude: Number;
  _Math: Math;
  constructor(
    private windowRefService:WindowRefService,
  ) {
    this._Math = Math;
    this.navigatorRef = this.windowRefService.nativeWindow.navigator;
    this.getUserLocation();
  }

  ngOnInit() {
  }

  mapCenterChange(center){
    console.log("mapCenterChange",center);
    this.longitude = center.lng;
    this.latitude = center.lat;
  }

  getUserLocation(){
    if(this.navigatorRef.geolocation){
      navigator.geolocation.getCurrentPosition((position)=>{
        this.startLongitude = position.coords.longitude;
        this.startLatitude = position.coords.latitude;
      },(error)=>{
        console.log("error",error);
      });
    }
  }
}
