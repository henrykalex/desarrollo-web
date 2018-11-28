import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { FileUploaderComponent } from '../../file-uploader/file-uploader/file-uploader.component';

import { ProductService } from '../../../services/product.service';
import { DialogService } from '../../../services/dialog.service';

import { ProductQuestions } from '../../../questions/product';
import { ProductRewardQuestions } from '../../../questions/product-reward';

import { AppConfig } from '../../../app.config';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
  productId: any;

  productStartValues: any;
  productValues: any;

  productQuestions: any[];

  isProductValid: boolean;
  isProductImageValid: boolean;
  isProductFeedingChartImageValid: boolean;

  uploadProductImageUrl: string;
  productImageUrl: string;
  uploadFeedingChartImageUrl: string;
  productFeedingChartImageUrl: string;

  imageUploadedCheck: boolean = false;

  @ViewChild('productImageUploader') productImageUploader:FileUploaderComponent;
  @ViewChild('productFeedingChartImageUploader') productFeedingChartImageUploader:FileUploaderComponent;
  productImageUploaderActive: boolean = false;
  productFeedingChartImageUploaderActive: boolean = false;

  isProductReward: boolean;
  constructor(
    protected activatedRoute:ActivatedRoute, protected productService:ProductService,
    protected router:Router, protected dialogService:DialogService
  ) {
    // this.productStartValues = {
    //   name: 'Pedro Juárez',
    //   category: 'chico',
    //   nutritional: 'SFAAW3254578D46',
    //   presentations: '2567345667',
    //   points: 20,
    //   cost: 100,
    // }
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data=>{
      this.isProductReward = data.reward;
      this.productQuestions = this.isProductReward?ProductRewardQuestions:ProductQuestions;
    });
    this.productImageUrl =
    AppConfig.apiURL+'product-images/';
    this.productFeedingChartImageUrl =
    AppConfig.apiURL+'product-feeding-chart-images/';
  }
  ngAfterViewInit(){
    console.log("ngAfterViewInit");
    this.productImageUploader.queue.subscribe(value=>{
      this.isProductImageValid = (value.length>0);
    });
    this.productFeedingChartImageUploader.queue.subscribe(value=>{
      this.isProductFeedingChartImageValid = (value.length>0);
    });
  }
  createProduct(){
    let productData = this.productValues;
    // DEBUG ONLY
    // productData = this.productStartValues;isProductReward
    console.log("this.productValues",this.productValues);
    if(this.isProductReward)
    productData.isReward = this.isProductReward;
    this.productService.createProduct(productData)
    .subscribe(async product=>{
      console.log("product",product);
      this.productId = product._id;
      await this.setImageLinks(this.productId);
      console.log("uploadAll")
      this.uploadAll();
    },error=>{
      console.log("error",error);
    });
  }

  imageUploaded(event, isProduct){
    console.log("imageUploaded",event);
    if(isProduct){
      this.productImageUploaderActive = false;
    }else{
      this.productFeedingChartImageUploaderActive = false;
    }
    if(!this.productFeedingChartImageUploaderActive && !this.productImageUploaderActive){
      this.dialogService.showMessage('Cargado','Se ha cargado corractemente.');
      // this.router.navigate(['admin',this.isProductReward?'productos-recompensa':'productos']);
      this.afterImageUploadd(event,isProduct);
    }else{
      this.imageUploadedCheck = true;
    }
  }
  uploadAll(){
    console.log("uploadAll");
    if(this.productImageUploader.uploader.url && this.productFeedingChartImageUploader.uploader.url){
      this._uploadAll();
    }else{
      setTimeout(()=>this.uploadAll(),100);
    }
  }
  _uploadAll(){
    console.log("_uploadAll");
    console.log("this.productImageUploader.uploader",this.productImageUploader.uploader.filesCount);
    console.log("this.productFeedingChartImageUploader.uploader",this.productFeedingChartImageUploader.uploader.filesCount)
    this.productImageUploaderActive = this.productImageUploader.uploader.filesCount>0;
    this.productFeedingChartImageUploaderActive = this.productFeedingChartImageUploader.uploader.filesCount>0;
    this.productImageUploader.uploader.uploadAll();
    this.productFeedingChartImageUploader.uploader.uploadAll();
  }
  setImageLinks(productId){
    this.uploadProductImageUrl =
    AppConfig.apiURL+'master/product/'+productId+'/image';
    this.uploadFeedingChartImageUrl =
    AppConfig.apiURL+'master/product/'+productId+'/feeding-chart-image';
    console.log("setImageLinks end")
  }
  afterImageUploadd(event,isProduct){}
}
@Component({
  selector: 'app-product-add-dialog',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponentDialog extends ProductAddComponent {
  isEdit: boolean = true;

  constructor(
    protected activatedRoute:ActivatedRoute, protected productService:ProductService,
    protected router:Router, public dialogRef: MatDialogRef<ProductAddComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, protected dialogService:DialogService
  ) {
    super(activatedRoute,productService,router,dialogService);
  }
  ngOnInit(){
    // super.ngOnInit();
    this.productStartValues = this.data.product;

    this.isProductReward = this.productStartValues.isReward;
    this.productQuestions = this.isProductReward?ProductRewardQuestions:ProductQuestions;

    this.productImageUrl =
    AppConfig.apiURL+'product-images/';
    this.productFeedingChartImageUrl =
    AppConfig.apiURL+'product-feeding-chart-images/';

    console.log("this.isProductReward",this.isProductReward);
    this.productId = this.productStartValues._id;
    this.setImageLinks(this.productId);
  }

  updateProduct(){
    let productData = this.productValues;
    // DEBUG ONLY
    // productData = this.productStartValues;
    console.log("this.productValues",this.productValues);
    if(this.productValues){
      this.productService.updateProduct(productData,this.productStartValues._id).subscribe(product=>{
        console.log("product",product);
        if(product){
          this.productStartValues = product;
          setTimeout(()=>{this.productValues = undefined},500);
          this.dialogRef.close(product);
        }

      },error=>{
        console.log("error",error);
      });
    }
    console.log("update images");
    if(this.isProductImageValid){
      this.productImageUploader.uploader.uploadAll();
      this.isProductImageValid = false;
    }
    if(this.isProductFeedingChartImageValid){
      this.productFeedingChartImageUploader.uploader.uploadAll();
      this.isProductFeedingChartImageValid = false;
    }
  }

  afterImageUploadd(event,isProduct){
    console.log("afterImageUploadd",event);
    if(isProduct){
      this.productStartValues.image = event.response.image;
    }else{
      this.productStartValues.feedingChartImage = event.response.image;
    }
    this.dialogRef.close(this.productStartValues);
  }
}
