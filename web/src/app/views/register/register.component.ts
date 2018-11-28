import { Component, OnInit } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { LocationSelectDialogComponent } from '../../shared/components/location-select-dialog/location-select-dialog.component';


import { TextboxQuestion } from '../../questions/question-textbox';

import { ClientQuestions } from '../../questions/client';
import { VeterinaryQuestions } from '../../questions/veterinary';
import { DistributorQuestions } from '../../questions/distributor';
import { DistributorReferenceQuestions } from '../../questions/distributorReference';
import { AddressQuestions } from '../../questions/address';

import { AuthService } from '../../auth/auth.service';
import { LoginType } from '../../classes/LoginType';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userModelQuestions: any[];
  addressQuestions: any[] = AddressQuestions;
  distributorReferenceQuestions:any[] = DistributorReferenceQuestions;

  registerType: string;
  registerTypeUrl: string;

  isLoading:boolean;
  errorMessage: string;
  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute, private authService:AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params:ParamMap)=>{
      let urlType = params.get("type");
      this.registerTypeUrl = urlType;
      this.registerType =
      urlType == 'distribuidor'?'distributor':
      urlType == 'veterinario'?'veterinary':
      '';
      console.log("this.registerType",this.registerType);
      if(!this.registerType)
      this.router.navigate(['registro']);

      this.userModelQuestions =
      this.registerType == 'distributor'?DistributorQuestions:
      this.registerType == 'veterinary'?VeterinaryQuestions:
      this.registerType == ''?ClientQuestions:
      null;

      this.addPasswordQuestion();
    });
  }
  addPasswordQuestion(){
    this.userModelQuestions = this.userModelQuestions.slice();
    this.userModelQuestions.push(new TextboxQuestion({
        key: 'password',
        type: 'password',
        label: 'CONTRASEÑA',
        required: true,
        order: 1,
      }));
  }
  register(event){
    console.log("register",event);
    this.isLoading = true;
    if(this.registerType != 'veterinary'){
      this._register(event);
    }else{
      let dialogRef = this.dialog.open(LocationSelectDialogComponent, {
        width: '90vw',
        height: '90vh',
        data: { },
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed',result);
        // this.productValues = result;
        event.location = [result.longitude,result.latitude];
        this._register(event);
      });
    }
  }
  _register(event){
    console.log("_register",event);
    this.authService.register(event,this.registerType).subscribe((response:any)=>{
      console.log("response",response)
      if(response.success == true){
        this.isLoading = false;
        response.type==LoginType.CLIENT?
        this.router.navigate(['/perfil']):
        response.type==LoginType.DISTRIBUTOR?
        this.showRegisterRequestModal():
        response.type==LoginType.VETERINARY?
        this.showRegisterRequestModal():
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

  showRegisterRequestModal(){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '550px',
      data: {
        title: 'Registro',
        content: 'Registro exitoso!, Deberás esperar a ser aprobado, recibirás un correo confirmando tu aprobación.',
        buttons: [
          {label:'Aceptar', action:()=>{
            this.router.navigate(['iniciar',this.registerTypeUrl]);
            dialogRef.close();
          }}
        ]
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      // this.productValues = result;
    });
  }

  goToLogin(){
    this.router.navigate(['iniciar',...(this.registerTypeUrl?[this.registerTypeUrl]:[])]);
  }

}
