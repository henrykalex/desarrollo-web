import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quantity-select-dialog',
  templateUrl: './quantity-select-dialog.component.html',
  styleUrls: ['./quantity-select-dialog.component.scss']
})
export class QuantitySelectDialogComponent implements OnInit {
  counterValue: number;
  constructor(
  ) { }

  ngOnInit() {
  }

}
