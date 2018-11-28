import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { Ng2Webstorage } from 'ngx-webstorage';
import { AgmCoreModule } from '@agm/core';

import { MaterialModule } from './material.module';

import { AuthInterceptor } from '../auth/auth-interceptor.service';
import { AuthGuard } from '../auth/auth-guard.service';

import { UserModelService } from '../services/user-model.service';
import { ProductService } from '../services/product.service';
import { UserLinkService } from '../services/user-link.service';
import { OrderService } from '../services/order.service';
import { RequestService } from '../services/request.service';
import { StatsService } from '../services/stats.service';
import { DialogService } from '../services/dialog.service';

import { HeaderComponent } from './components/header/header.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';

import { ProfileComponent } from './views/profile/profile.component';
import { ProductsComponent } from './views/products/products.component';
import { ProductsRewardComponent } from './views/products-reward/products-reward.component';
import { ProductViewComponent } from './views/product-view/product-view.component';
import { OrdersRequestsComponent } from './views/orders-requests/orders-requests.component';
import { OrderNewComponent } from './views/order-new/order-new.component';
import { RequestNewComponent } from './views/request-new/request-new.component';
import { OrderRequestViewComponent } from './views/order-request-view/order-request-view.component';
import { UserModelsComponent } from './views/user-models/user-models.component';
import { UserModelViewComponent } from './views/user-model-view/user-model-view.component';

import { StatsComponent } from './views/stats/stats.component';
import { LinkUserComponent } from './views/link-user/link-user.component';

import { TableComponent } from './components/table/table.component';
import { FormComponent } from './components/form/form.component';
import { FormQuestionComponent } from './components/form-question/form-question.component';
import { QrscannerComponent } from './components/qrscanner/qrscanner.component';
import { LocationSelectorComponent } from '../shared/components/location-selector/location-selector.component';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ImageDialogComponent } from './components/image-dialog/image-dialog.component';
import { QuantitySelectDialogComponent } from './components/quantity-select-dialog/quantity-select-dialog.component';
import { UserModelEditComponentDialog } from '../admin/views/user-model-add/user-model-edit-dialog.component';
import { ProductsAddListComponent } from '../shared/components/products-add-list/products-add-list.component';
import { LocationSelectDialogComponent } from '../shared/components/location-select-dialog/location-select-dialog.component';
import { LoadingDialogComponent } from '../shared/components/loading-dialog/loading-dialog.component';

import { CounterComponent } from './components/counter/counter.component';

const sharedModules:any = [
  CommonModule,
  MaterialModule,
  RouterModule,
  HttpClientModule,
  ReactiveFormsModule,
  QRCodeModule,
  Ng2Webstorage,
  AgmCoreModule
];

const shareEntryComponents: any = [
  ConfirmDialogComponent,
  ImageDialogComponent,
  QuantitySelectDialogComponent,
  UserModelEditComponentDialog,
  ProductsAddListComponent,
  LocationSelectDialogComponent,
  LoadingDialogComponent
];
const sharedComponents:any = [
  HeaderComponent,
  ProfileComponent,
  SideMenuComponent,
  FormComponent,
  FormQuestionComponent,
  TableComponent,
  ProductsComponent,
  ProductsRewardComponent,
  ProductViewComponent,
  OrdersRequestsComponent,
  OrderNewComponent,
  RequestNewComponent,
  OrderRequestViewComponent,
  UserModelsComponent,
  UserModelViewComponent,
  StatsComponent,
  LinkUserComponent,
  QrscannerComponent,
  CounterComponent,
  LocationSelectorComponent,
].concat(shareEntryComponents);



@NgModule({
  imports: sharedModules.concat([ZXingScannerModule.forRoot()]),
  declarations: sharedComponents,
  exports: sharedModules.concat(sharedComponents,[ZXingScannerModule]),
  providers: [
    AuthGuard,
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },
    UserModelService,
    ProductService,
    UserLinkService,
    OrderService,
    RequestService,
    StatsService,
    DialogService
  ],
  entryComponents: shareEntryComponents
})
export class SharedModule { }
