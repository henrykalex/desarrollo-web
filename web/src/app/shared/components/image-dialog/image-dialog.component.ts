import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {
  imageUrl: string;
  imageAlt: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.imageUrl = data.imageUrl;
    this.imageAlt = data.imageAlt;
  }

  ngOnInit() {

  }

}
