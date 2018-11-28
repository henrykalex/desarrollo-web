import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginType, TypeFunctions } from '../../../classes/LoginType';

import { UserModelService } from '../../../services/user-model.service';
import { UserLinkService } from '../../../services/user-link.service';
import { AuthService } from '../../../auth/auth.service';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-user-models',
  templateUrl: './user-models.component.html',
  styleUrls: ['./user-models.component.scss']
})
export class UserModelsComponent implements OnInit {
  userDisplayType: string;

  tableFunction: any;
  secondTableFunction: any;
  columns: any[];

  constructor(
    private activatedRoute:ActivatedRoute, private userModelService:UserModelService,
    private authService: AuthService, private router:Router,
    private userLinkService:UserLinkService, private dialogService:DialogService
  ) {
    this.columns = [
      {name:'Nombre', key: 'name'},
      // {name:'Bandera', key: 'flag'},
    ];
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data=>{
      console.log("data",data);
      this.userDisplayType = data.type;
      if(this.authService.isMaster){
        this.getTables();
      }else{
        this.tableFunction = this.userLinkService.getLinkedUsersFunction(this.userDisplayType);
      }
    });
  }

  private getTables(){
    this.tableFunction = this.userModelService.getUserModelByPageFunction(this.userDisplayType);
    console.log("this.tableFunction",this.tableFunction);
    this.secondTableFunction = this.userModelService.getUserModelByPageFunction(this.userDisplayType,true);
  }

  getUserLink(){
    return TypeFunctions.parseUserLink(this.userDisplayType);
  }

  viewUserModel(user){
    console.log("this.getUserLink()",this.getUserLink());
    let navArray = [];
    if(!this.authService.isMaster)
    navArray.push('ver')
    navArray = navArray.concat([this.getUserLink(),user._id]);
    console.log("viewUserModel",navArray);
    this.router.navigate(navArray,{
      relativeTo:this.authService.loginType!='client'?this.activatedRoute.parent:null
    });
  }

  openLinkUser(linkUserType){
    console.log("linkUserType",linkUserType);
    this.router.navigate(['escaner',linkUserType],{relativeTo:this.authService.loginType!='client'?this.activatedRoute.parent:null});
  }
  viewUserModelAprove(user){
    this.userModelService.aprove(user._id,this.userDisplayType)
    .subscribe(response=>{
      if(response){
        user.estatus = 'active';
        this.getTables();
        this.dialogService.showMessage("Aprobado","Se ha aprobado correctamente.");

      }

    });
  }

}
