import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-location-select-dialog',
  templateUrl: './location-select-dialog.component.html',
  styleUrls: ['./location-select-dialog.component.scss']
})
export class LocationSelectDialogComponent implements OnInit {
  selectedLongitude: Number;
  slectedLatitude: Number;

  isUpdate: boolean;
  constructor(
    private matDialogRef: MatDialogRef<LocationSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
  }
  selectLocation(){
    this.matDialogRef.close({
      longitude: this.selectedLongitude,
      latitude: this.slectedLatitude,
    });
  }
}
