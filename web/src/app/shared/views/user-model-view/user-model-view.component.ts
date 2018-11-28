import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import { LoginType, TypeFunctions } from '../../../classes/LoginType';

import { UserModelService } from '../../../services/user-model.service';
import { UserLinkService } from '../../../services/user-link.service';
import { AuthService } from '../../../auth/auth.service';
import { OrderService } from '../../../services/order.service';
import { DialogService } from '../../../services/dialog.service';

import { ClientQuestions } from '../../../questions/client';
import { VeterinaryQuestions } from '../../../questions/veterinary';
import { DistributorQuestions } from '../../../questions/distributor';
import { DistributorReferenceQuestions } from '../../../questions/distributorReference';
import { AddressQuestions } from '../../../questions/address';

import { UserModelEditComponentDialog } from '../../../admin/views/user-model-add/user-model-edit-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-model-view',
  templateUrl: './user-model-view.component.html',
  styleUrls: ['./user-model-view.component.scss']
})
export class UserModelViewComponent implements OnInit {
  userModelQuestions: any[];
  addressQuestions: any[] = AddressQuestions;
  distributorReferenceQuestions:any[] = DistributorReferenceQuestions;

  userModelValues: any;
  addressValues: any;
  distributorReferenceValues: any;

  userDisplayType: string;
  userModelId: string;
  isMaster: boolean;
  isProfile: boolean = false;

  distributorsTableFunction: any;
  veterinariesTableFunction: any;
  clientsTableFunction: any;
  userOrdersTableFunction: any;
  rewardProductsTableFunction: any;

  columns: any[];
  orderColumns: any[];
  constructor(
    private activatedRoute:ActivatedRoute, private userModelService:UserModelService,
    private authService: AuthService, private router:Router, private userLinkService:UserLinkService,
    private dialog: MatDialog, private location:Location, private orderService:OrderService,
    private dialogService:DialogService
  ) {
    this.columns = [
      {name:'Nombre', key: 'name'}
    ];
    this.orderColumns = [
      {name:'Fecha', key: 'date', pipe: 'date'},
    ];
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data=>{
      console.log("data",data);
      this.userDisplayType = data.type;
      this.userModelQuestions =
      this.userDisplayType == 'distributor'?DistributorQuestions:
      this.userDisplayType == 'veterinary'?VeterinaryQuestions:
      this.userDisplayType == 'client'?ClientQuestions:
      null;
    });
    this.authService.isLoggedInObsevable.subscribe(value=>{
      if(value)
      this.isMaster = this.authService.isMaster;
      console.log("this.isMaster",this.isMaster);
      let compareType = this.userDisplayType=='client'&&this.authService.loginTypeUrl==''?'client/':this.authService.loginTypeUrl;
      let compareTemp = this.userDisplayType+'/';
      console.log("==",compareTemp, compareType);
      if(this.isMaster || compareTemp != compareType){
        this.activatedRoute.paramMap.subscribe((paramMap:ParamMap)=>{
          let userId = paramMap.get('id');
          console.log("userId",userId);
          this.userModelId = userId;
          this.isProfile = false;
          this.getUserData(this.isMaster);
        });
      }else{
        this.getProfile();
      }
    });

  }
  getProfile(){
    console.log("getProfile");
    this.isProfile = true;
    this.userModelService.getUserProfile()
    .subscribe((userData:any)=>{
      if(userData)
      this.userModelValues = userData;
      console.log("this.userModelValues",this.userModelValues);
      if(this.userModelValues)
      this.editFieldsForUser();
      this.userModelId = userData._id;
    });
  }
  getUserData(isMaster){
    this.userModelService.getUserModel(this.userDisplayType,this.userModelId,isMaster).subscribe((userData:any)=>{
      if(userData)
      this.userModelValues = userData;
      console.log("this.userModelValues",this.userModelValues);
      if(this.userModelValues)
      this.editFieldsForUser();
    });

    if(this.userDisplayType == 'distributor' || this.userDisplayType == 'client'){
      this.veterinariesTableFunction = this.userLinkService.getLinkedUsersFunction('veterinary',this.userDisplayType,this.userModelId);
    }
    if(this.userDisplayType == 'veterinary'){
      this.distributorsTableFunction = this.userLinkService.getLinkedUsersFunction('distributor',this.userDisplayType,this.userModelId);
      this.clientsTableFunction = this.userLinkService.getLinkedUsersFunction('client',this.userDisplayType,this.userModelId);
    }
    this.userOrdersTableFunction = this.orderService.getUserOrdersByPageFunction(this.userDisplayType,this.userModelId);
    this.rewardProductsTableFunction = this.userModelService.getProductsInventoryReward(this.userDisplayType,this.userModelId);
  }

  openLinkUser(linkUserType){
    console.log("linkUserType",linkUserType);
    let linkToUserData = this.isMaster?{
      linkToUserType: this.userDisplayType,
      linkToUserId: this.userModelId,
    }:{};

    this.router.navigate(['escaner',linkUserType],{
      queryParams: linkToUserData,
      relativeTo:this.authService.loginType!='client'?this.activatedRoute.parent:null
    });
  }

  editUser(){
    let dialogRef = this.dialog.open(UserModelEditComponentDialog, {
      width: '650px',
      height: '90vh',
      data: {
        user: this.userModelValues,
        userDisplayType: this.userDisplayType,
        isProfile: this.isProfile
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      if(result){
        this.dialogService.showMessage("Actualizado","Se ha actualizado correctamente.");
        this.userModelValues = result;
        if(this.userDisplayType == 'distributor' || this.userDisplayType == 'veterinary'){
          this.userModelValues.shippingAddressParsed = this.parseAddress(this.userModelValues.shippingAddress);
        }
        if(this.userDisplayType == 'distributor'){
          this.userModelValues.legalAddressParsed = this.parseAddress(this.userModelValues.legalAddress);
          this.userModelValues.referenceParsed = this.parseReference(this.userModelValues.reference);
        }
      }
    });
  }

  deleteUser(){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20vw',
      height: '15vh',
      data: {
        title: "Eliminar usuario",
        content: "¿Realmente desea eliminar el usuario?",
        buttons: [{label:"SI",accept:true},{label:"NO",cancel:true}]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      if(result){
        this.dialogService.showMessage("Eliminado","Se ha eliminado correctamente.");

        this.userModelService.deleteUserModel(this.userModelValues._id,this.userDisplayType)
        .subscribe(user=>{
          console.log("user",user);
          this.location.back();
        },error=>{
          console.log("error",error);
          this.dialogService.showErrorMessage(error.error.message);
        });
      }
    });
  }

  unlinkUser(unlinkUserType, unlinkUserId?){
    let unlinkToUserData = this.isMaster?{
      unlinkFromUserType: this.userDisplayType,
      unlinkFromUserId: this.userModelId,
    }:{};
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20vw',
      height: '15vh',
      data: {
        title: 'Confirmar',
        content: '¿Seguro desea desafiliar el usuario?',
        buttons: [
          {label: 'SI', accept: true},
          {label: 'NO', cancel: true},
        ]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      if(result){
        // TODO: Open loading dialog
        this.dialogService.showMessage("Desligar","Se ha desligado correctamente.");

        this.userLinkService.unlinkUser(this.userDisplayType,this.userModelId).subscribe()
      }

    });
  }

  viewUserModel(userModel,user){
    let urlRoute=this.authService.isMaster?[userModel, user._id]:['ver',userModel, user._id];
    // console.log("urlRoute",urlRoute);
    this.router.navigate(urlRoute,{relativeTo:this.authService.loginType!='client'?this.activatedRoute.parent:null});
  }
  viewUserOrder(order){
    this.router.navigate(['pedido',order._id],{relativeTo:this.activatedRoute.parent});
  }

  private editFieldsForUser(){
    this.userModelQuestions = Object.assign([],this.userModelQuestions);
    let questionIndex = this.userModelQuestions.findIndex((question:any)=>question.key=='referenceCode');
    this.userModelQuestions.splice(questionIndex,1);
    if(this.userDisplayType == 'distributor' || this.userDisplayType == 'veterinary'){
      this.userModelValues.shippingAddressParsed = this.parseAddress(this.userModelValues.shippingAddress);
      this.userModelQuestions.push({key:'shippingAddressParsed', label: 'DOMICILIO DE ENTREGA'});
    }
    if(this.userDisplayType == 'distributor'){
      this.userModelValues.legalAddressParsed = this.parseAddress(this.userModelValues.legalAddress);
      this.userModelQuestions.push({key:'legalAddressParsed', label: 'DOMICILIO FISCAL'});
      this.userModelValues.referenceParsed = this.parseReference(this.userModelValues.reference);
      this.userModelQuestions.push({key:'referenceParsed', label: 'REFERENCIAS'});
    }
    if(this.userDisplayType == 'client' || this.userDisplayType == 'veterinary'){
      let questionIndex = this.userModelQuestions.findIndex((question:any)=>question.key=='distributorCode'||question.key=='veterinaryCode');
      this.userModelQuestions.splice(questionIndex,1);
    }
  }

  private parseAddress(addressObject){
    let address = '';
    address += addressObject.street+', ';
    address += addressObject.number+', ';
    address += addressObject.city+', ';
    address += addressObject.state+', ';
    address += addressObject.postalcode+', ';
    address += addressObject.country;
    return address;
  }

  private parseReference(referenceObject){
    let reference = '';
    reference += referenceObject.name+', ';
    reference += referenceObject.relationship+', ';
    reference += referenceObject.phone+', ';
    reference += referenceObject.address;
    return reference;
  }

  showPoints(){
    return this.isMaster ||
    this.userDisplayType == this.authService.loginType ||
    (this.userDisplayType == 'veterinary' && this.authService.loginType=='distributor') ||
    (this.userDisplayType == 'client' && this.authService.loginType=='veterinary');
  }
}
