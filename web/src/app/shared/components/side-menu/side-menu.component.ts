import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @Input() links: any[] = [];
  @Output() closeMenu: EventEmitter<true> = new EventEmitter<true>();

  constructor() {
  }

  ngOnInit() {
  }

}
