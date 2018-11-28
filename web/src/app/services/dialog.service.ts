import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingDialogComponent } from '../shared/components/loading-dialog/loading-dialog.component';

@Injectable()
export class DialogService {
  loadingDialogRef: MatDialogRef<LoadingDialogComponent>;
  constructor(
    private dialog: MatDialog
  ) { }

  showErrorMessage(message){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      // width: '20vw',
      // height: '20vh',
      data: {
        title: "Error",
        content: message,
        buttons: [{label:"ACEPTAR",accept:true}]
      }
    });
  }

  showMessage(title,message){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      // width: '20vw',
      // height: '20vh',
      data: {
        title: title,
        content: message,
        buttons: [{label:"ACEPTAR",accept:true}]
      }
    });
  }

  showLoading(){
    if(!this.loadingDialogRef)
    this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, {
      // width: '20vw',
      // height: '20vh',
      disableClose: true,
      data: {}
    });
  }
  hideLoading(){
    if(this.loadingDialogRef)
    this.loadingDialogRef.close();
    this.loadingDialogRef = null;
  }
}
