import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserModelService } from '../../../services/user-model.service';

import { MatDialog, MatDialogRef } from '@angular/material';
import { LocationSelectDialogComponent } from '../../../shared/components/location-select-dialog/location-select-dialog.component';

import { ClientQuestions } from '../../../questions/client';
import { VeterinaryQuestions } from '../../../questions/veterinary';
import { DistributorQuestions } from '../../../questions/distributor';
import { DistributorReferenceQuestions } from '../../../questions/distributorReference';
import { AddressQuestions } from '../../../questions/address';

@Component({
  selector: 'app-user-model-add',
  templateUrl: './user-model-add.component.html',
  styleUrls: ['./user-model-add.component.scss']
})
export class UserModelAddComponent implements OnInit {
  userId: string;
  // DEBUG ONLY
  userModelValues: any;
  addressStartValues: any;
  legalAddressStartValues: any;
  distributorReferenceValues: any;

  userModelQuestions: any[];
  addressQuestions: any[] = AddressQuestions;
  distributorReferenceQuestions:any[] = DistributorReferenceQuestions;
  userDisplayType: string;

  userValues: any;
  addressValues: any;
  legalAddressValues: any;
  referenceValues: any;

  isUserValid: boolean;
  addressValid: boolean;
  legalAddressValid: boolean;
  referenceValid: boolean;

  dataSubscription: Subscription;
  constructor(
    protected router: Router, protected matDialog:MatDialog,
    protected activatedRoute:ActivatedRoute, protected userModelService:UserModelService,
  ) {
    // this.userModelValues = {
    //   name: 'Pedro Juárez',
    //   legalUserName: 'Franquicias mexicanas',
    //   rfc: 'SFAAW3254578D46',
    //   phone: '2567345667',
    //   referenceCode: 'asf67gsd76f',
    //   email: 'pedro@mail.com',
    // }
    // this.addressStartValues = {
    //   street: 'Colina del monte',
    //   number: '43',
    //   country: 'México',
    //   postalcode: '02466',
    //   state: 'Querétaro',
    //   city: 'Querétaro'
    // }
    // this.distributorReferenceValues = {
    //   name: 'Alonso',
    //   phone: '23456654',
    //   relationship: 'Papá',
    //   address: 'Colina del monte 24'
    // }
  }

  ngOnInit() {
    this.dataSubscription = this.activatedRoute.data.subscribe(this.processUserType);
  }

  processUserType = (data)=>{
    console.log("data",data);
    this.userDisplayType = data.type;
    this.userModelQuestions =
    this.userDisplayType == 'distributor'?DistributorQuestions:
    this.userDisplayType == 'veterinary'?VeterinaryQuestions:
    this.userDisplayType == 'client'?ClientQuestions:
    null;
    console.log("this.userDisplayType",this.userDisplayType);
    console.log("this.userModelQuestions",this.userModelQuestions,DistributorQuestions);

  }

  createUser(){
    let userData = this.userValues;
    // userData = this.userModelValues;
    if(this.userDisplayType == 'distributor'){
      userData.shippingAddress = this.addressValues;
      userData.legalAddress = this.legalAddressValues;
      userData.reference = this.referenceValues;
    }
    if(this.userDisplayType == 'veterinary'){
      userData.shippingAddress = this.addressValues;
    }
    this._createUser(userData);

  }
  _createUser(userData){
    console.log("userData",userData);
    this.userModelService.createUserModel(this.userDisplayType,userData).subscribe(response=>{
      console.log("response",response);
      let userModelsRoute  =
      this.userDisplayType == 'distributor'?'distribuidores':
      this.userDisplayType == 'veterinary'?'tiendas':
      this.userDisplayType == 'client'?'clientes':
      null;
      this.router.navigate(['admin',userModelsRoute]);
    },error=>{
      console.log("error",error);
    });
  }

}
