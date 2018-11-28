import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import {Location } from '@angular/common';
import { CodeQuestions } from '../../../questions/code';

import { FormComponent } from '../../components/form/form.component';

import { UserLinkService } from '../../../services/user-link.service';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-link-user',
  templateUrl: './link-user.component.html',
  styleUrls: ['./link-user.component.scss']
})
export class LinkUserComponent implements OnInit {
  @ViewChild('codeForm') codeForm: FormComponent;
  codeQuestions: any[] = CodeQuestions;
  errorMessage: string;
  isLoading: boolean;

  userDisplayType: string;
  linkToUserId: string;
  linkToUserType: string;
  constructor(
    private userLinkService:UserLinkService, private activatedRoute:ActivatedRoute,
    private router:Router, private location:Location, private dialogService:DialogService
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data=>{
      console.log("data",data);
      this.userDisplayType = data.type;

      this.activatedRoute.queryParamMap.subscribe((paramMap:ParamMap)=>{
        let linkToUserId = paramMap.get('linkToUserId');
        console.log("linkToUserId",linkToUserId);
        this.linkToUserId = linkToUserId;

        let linkToUserType = paramMap.get('linkToUserType');
        console.log("linkToUserType",linkToUserType);
        this.linkToUserType = linkToUserType;
      });
    });
  }

  linkCode(event){
    console.log("linkCode",event);
    this.isLoading = true;
    let userCode = event.code?event.code:event;
    this.userLinkService.linkUser(this.userDisplayType,userCode,this.linkToUserType,this.linkToUserId)
    .subscribe(success=>{
      this.isLoading = false;
      console.log("success",success);
      this.location.back();
    },error=>{
      this.isLoading = false;
      console.log("error",error);
      this.dialogService.showErrorMessage(error.error.message);
    });
  }

  qrCodeDetected(event){
    if(event){
      this.codeForm.values = {code:event};
      this.linkCode(event);
    }else{
      this.codeForm.values = {code:''};
      this.errorMessage = null;
    }

  }
}
