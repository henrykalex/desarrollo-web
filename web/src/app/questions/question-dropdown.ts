import { QuestionBase } from './question-base';

export class DropdownQuestion extends QuestionBase{
  controlType = 'dropdown';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }

  getValue(key){
    let option = this.options.find(option=>option.key == key);
    return option?option.value:'';
  }
}
