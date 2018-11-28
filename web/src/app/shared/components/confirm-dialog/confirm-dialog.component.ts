import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  title: string;
  content: string;
  contentParsed: any[];
  buttons: any[];
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, content: string,buttons: any[]}
  ) { }

  ngOnInit() {
    this.title = this.data.title;
    this.content = this.data.content;
    this.buttons = this.data.buttons;
    console.log("this.content",this.content);
    if(this.content)
    this.contentParsed = this.content.split(/&:|&,|&/g);
    console.log("this.contentParsed",this.contentParsed);
  }
}
