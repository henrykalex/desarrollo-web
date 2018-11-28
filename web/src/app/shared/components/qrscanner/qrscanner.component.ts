import { Component, VERSION, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { ZXingScannerComponent } from '@zxing/ngx-scanner';

import { Result } from '@zxing/library';


@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.component.html',
  styleUrls: ['./qrscanner.component.scss']
})
export class QrscannerComponent implements OnInit {
  @Input() isLoadingCode: boolean;
  @Output() codeDetected: EventEmitter<string> = new EventEmitter<string>();

  ngVersion = VERSION.full;

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;

  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;

  ngOnInit(): void {

      this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
          this.hasCameras = true;

          console.log('Devices: ', devices);
          this.availableDevices = devices;
          // this.scanner.changeDevice(this.availableDevices[0]);
          this.selectedDevice = this.availableDevices[0];
          // selects the devices's back camera by default
          // for (const device of devices) {
          //     if (/back|rear|environment/gi.test(device.label)) {
          //         this.scanner.changeDevice(device);
          //         this.selectedDevice = device;
          //         break;
          //     }
          // }
      });

      this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
          console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
      });

      this.scanner.permissionResponse.subscribe((answer: boolean) => {
        console.log("permissionResponse",answer);
        this.hasPermission = answer;
      });

  }

  handleQrCodeResult(resultString: string) {
      console.log('Result: ', resultString);
      if(!this.isLoadingCode){
        this.qrResultString = resultString;
        this.codeDetected.emit(this.qrResultString);
      }
  }

  onDeviceSelectChange(selectedValue: string) {
      console.log('Selection changed: ', selectedValue);
      this.selectedDevice = this.scanner.getDeviceById(selectedValue);
  }

  reset(){
    this.qrResultString = '';
    this.codeDetected.emit(this.qrResultString);
  }

}
