import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { FileUploaderModule } from './file-uploader/file-uploader.module';

import { AdminComponent } from './admin/admin.component';
import { UserModelAddComponent } from './views/user-model-add/user-model-add.component';
import { ProductAddComponent,ProductAddComponentDialog } from './views/product-add/product-add.component';


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FileUploaderModule
  ],
  declarations: [
    AdminComponent,
    UserModelAddComponent,
    ProductAddComponent,
    ProductAddComponentDialog
  ],
  entryComponents: [
    ProductAddComponentDialog
  ]
})
export class AdminModule { }
