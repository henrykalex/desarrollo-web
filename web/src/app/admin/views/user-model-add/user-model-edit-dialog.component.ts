import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModelAddComponent } from './user-model-add.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { LocationSelectDialogComponent } from '../../../shared/components/location-select-dialog/location-select-dialog.component';

import { UserModelService } from '../../../services/user-model.service';

@Component({
  selector: 'app-user-model-edit-dialog',
  templateUrl: './user-model-add.component.html',
  styleUrls: ['./user-model-add.component.scss']
})
export class UserModelEditComponentDialog extends UserModelAddComponent {
  isEdit: boolean = true;
  isProfile: boolean;

  userLocation:any;
  constructor(
    protected activatedRoute:ActivatedRoute, protected userModelService:UserModelService,
    protected router:Router, public dialogRef: MatDialogRef<UserModelEditComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, protected matDialog:MatDialog
  ) {
    super(router,matDialog,activatedRoute,userModelService );
  }
  ngOnInit(){
    super.ngOnInit();
    this.dataSubscription.unsubscribe();
    this.processUserType({type:this.data.userDisplayType});
    this.editFieldsForUser();
    this.setUserModelData(this.data.user);
    this.userId = this.userModelValues._id;
    console.log("this.userModelValues",this.userModelValues);
    this.isProfile = this.data.isProfile;
  }

  updateUserModel(){
    let userData = this.userValues?this.userValues:{};
    if(this.userLocation)
    userData.location = this.userLocation;
    console.log("updateUserModel",this.addressValues,this.legalAddressValues,this.referenceValues)
    if(this.userDisplayType == 'distributor'){
      if(this.addressValues)
      userData.shippingAddress = this.addressStartValues?Object.assign(this.addressStartValues ,this.addressValues):this.addressValues;
      if(this.legalAddressValues)
      userData.legalAddress = this.legalAddressStartValues?Object.assign(this.legalAddressStartValues ,this.legalAddressValues):this.legalAddressValues;
      if(this.referenceValues)
      userData.reference = this.distributorReferenceValues?Object.assign(this.distributorReferenceValues ,this.referenceValues):this.referenceValues;
    }
    if(this.userDisplayType == 'veterinary' && this.addressValues){
      userData.shippingAddress = Object.assign(this.addressStartValues, this.addressValues);
    }
    // DEBUG ONLY
    // productData = this.productStartValues;
    console.log("userData",userData);
    if(userData){
      let updateFunction =
      this.isProfile?this.userModelService.updateUserProfile(userData):
      this.userModelService.updateUserModel(userData,this.userModelValues._id, this.userDisplayType)
      updateFunction.subscribe(user=>{
        console.log("user",user);
        this.setUserModelData(user);
        setTimeout(()=>{this.userValues = undefined},500);
      },error=>{
        console.log("error",error);
      });
    }
  }

  updateLocation(){
    let dialogRef = this.matDialog.open(LocationSelectDialogComponent, {
      width: '90vw',
      height: '90vh',
      data: { location: this.userModelValues.location},
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      // this.productValues = result;
      this.userLocation = [result.longitude,result.latitude];
      this.updateUserModel();
    });
  }

  private setUserModelData(userdata){
    this.userModelValues = userdata;
    if(this.userDisplayType == 'distributor'){
      if(userdata.shippingAddress)
      this.addressStartValues = userdata.shippingAddress;
      if(userdata.legalAddress)
      this.legalAddressStartValues = userdata.legalAddress;
      if(userdata.reference)
      this.distributorReferenceValues = userdata.reference;
    }
    if(this.userDisplayType == 'veterinary' && userdata.shippingAddress){
      this.addressStartValues = userdata.shippingAddress;
    }
  }

  private editFieldsForUser(){
    this.userModelQuestions = Object.assign([],this.userModelQuestions);
    let questionIndex = this.userModelQuestions.findIndex((question:any)=>question.key=='referenceCode');
    this.userModelQuestions.splice(questionIndex,1);
    if(this.userDisplayType == 'client' || this.userDisplayType == 'veterinary'){
      let questionIndex = this.userModelQuestions.findIndex((question:any)=>question.key=='distributorCode'||question.key=='veterinaryCode');
      this.userModelQuestions.splice(questionIndex,1);
    }
  }
}
