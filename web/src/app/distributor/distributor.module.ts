import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DistributorRoutingModule } from './distributor-routing.module';

import { DistributorComponent } from './distributor/distributor.component';

@NgModule({
  imports: [
    CommonModule,
    DistributorRoutingModule,
    SharedModule
  ],
  declarations: [DistributorComponent]
})
export class DistributorModule { }
