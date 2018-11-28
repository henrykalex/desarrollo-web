import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { VeterinaryRoutingModule } from './veterinary-routing.module';

import { VeterinaryComponent } from './veterinary/veterinary.component';

@NgModule({
  imports: [
    CommonModule,
    VeterinaryRoutingModule,
    SharedModule
  ],
  declarations: [VeterinaryComponent]
})
export class VeterinaryModule { }
