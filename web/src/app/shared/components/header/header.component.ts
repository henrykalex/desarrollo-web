import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() userName: string;

  @Output() profile: EventEmitter<true> = new EventEmitter<true>();
  @Output() openMenu: EventEmitter<true> = new EventEmitter<true>();
  constructor() {
  }

  ngOnInit() {
  }

  goToProfile(){
    this.profile.emit(true);
  }

}
