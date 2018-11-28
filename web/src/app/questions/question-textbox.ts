import { QuestionBase } from './question-base';

export class TextboxQuestion extends QuestionBase {
  controlType = 'textbox';

  constructor(options: {} = {}) {
    super(options);
  }
}
