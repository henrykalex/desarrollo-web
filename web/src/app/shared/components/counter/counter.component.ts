import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  @Input() set value(value: number){
    if(value)
    this.counter.setValue(value);
  };
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  counter: FormControl;
  constructor() {
    this.counter = new FormControl(0,[Validators.min(0)]);
  }

  ngOnInit() {
    this.counter.valueChanges.subscribe(value=>{
      this.valueChange.emit(value);
    });
  }

  add(){
    this.counter.setValue(this.counter.value+1);
  }

  remove(){
    if(this.counter.value>0){
      this.counter.setValue(this.counter.value-1);
      this.valueChange.emit(this.counter.value);
    }
  }

}
