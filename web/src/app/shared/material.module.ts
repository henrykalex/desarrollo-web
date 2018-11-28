import { NgModule } from '@angular/core';
import {
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatDialogModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatTabsModule
 } from '@angular/material/';


const matModules = [
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatDialogModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatTabsModule
];

@NgModule({
  imports: matModules,
  declarations: [],
  exports: matModules
})
export class MaterialModule { }
