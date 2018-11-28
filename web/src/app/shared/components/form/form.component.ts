import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '../../../questions/question-base';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  _questions: QuestionBase[];
  @Input() set questions(value: QuestionBase[]){
    this._questions = value;
    if(this.questions){
      this.form = this.toFormGroup(this.questions);
      if(this.values){
        this.setValues();
        // this.subscribeToChange();
      }
    }
  }
  get questions():QuestionBase[]{
    return this._questions;
  }


  form: FormGroup = new FormGroup({});
  // Info access
  @Input() set reset(value: true){
    this.form.reset({});
  }
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() valuesChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() validChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  // View / Edit data
  _values: any = null;
  @Input() set values(value: any){
    this._values = value;
    if(this.form && this.values){
      this.setValues();
      // this.subscribeToChange();
    }
  }
  get values(): any{
    return this._values;
  }
  valuesChangeSubscription: Subscription;
  valuesChanged: boolean = false;

  // View control
  @Input() submitText: string;
  @Input() hideSubmit: true = null;
  @Input() isEditing: boolean = true;

  @Input() isLoading:boolean;
  @Input() errorMessage: string;
  @Input() oneCol: boolean;
  constructor() { }

  ngOnInit() {
    this.subscribeToChange();
  }
  setValues(){
    for(let prop in this.values){
      let formControl = this.form.get(prop);
      if(formControl)
      formControl.setValue(this.values[prop]);
    }
  }
  subscribeToChange(){
    // console.log("subscribeToChange");
    this.valuesChanged = false;
    if(!this.valuesChangeSubscription)
    this.valuesChangeSubscription = this.form.valueChanges.subscribe(values=>{
      // console.log("valueChanges",values);
      let emitValues = null;
      if(this.values){
        emitValues = {};
        for(let prop in values){
          if(this.values[prop] != values[prop]){
            this.valuesChanged = true;
            emitValues[prop] = values[prop];
          }
        }
      }
      // console.log("valueChanges",emitValues);
      this.valuesChange.emit(emitValues?emitValues:values);
      this.validChange.emit(this.form.valid);
    });
  }

  submit(){
    let value = this.form.value;
    let emitValues = null;
    if(this.values){
      emitValues = {};
      for(let prop in this.values){
        // console.log("prop",prop);
        if(value[prop]){
          if(this.values[prop] != value[prop]){
            // console.log("value[prop]",value[prop]);
            emitValues[prop] = value[prop];
          }
        }else{
          emitValues[prop] = this.values[prop];
        }

      }
    }

    this.onSubmit.emit(emitValues?emitValues:value);
  }

  toFormGroup(questions: QuestionBase[] ) {
    let group: any = {};

    questions.forEach(question => {
      var tempFC =  new FormControl({value: "",disabled:question.disabled});
      if(question.required)
      tempFC.setValidators(Validators.required);
      // REF: http://emailregex.com
      let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(question.type == 'email')
      tempFC.setValidators([Validators.pattern(emailRegex),Validators.required]);
      if(question.type == 'date')
      tempFC.setValidators([Validators.pattern('[0-9]{2}\/[0-9]{2}\/[0-9]{4}'),Validators.required]);
      if(question.type == 'currency')
      tempFC.setValidators([Validators.pattern('^(\\$|)(|\\ )(\\d{1,3}(\\,\\d{3})*|(\\d+))(\\.\\d{2})?$'),Validators.required]);
      // if(question.type == 'code')
      // tempFC.setValidators([Validators.pattern('[0-9]{2}\/[0-9]{2}\/[0-9]{4}'),Validators.required]);
      if(question.type == 'number')
      tempFC.setValidators([Validators.min(0),Validators.max(999999),Validators.required]);

      // group[question.key] = question.required ? new FormControl('', Validators.required)
      //                                         : new FormControl('');
      group[question.key] = tempFC;
    });
    return new FormGroup(group);
  }

}
