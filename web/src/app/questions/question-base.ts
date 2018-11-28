export class QuestionBase {
  type: string;
  key: string;
  label: string;
  required: boolean;
  order: number;
  disabled: boolean;
  controlType: string;

  constructor(options: {
      type?: string,
      key?: string,
      label?: string,
      required?: boolean,
      order?: number,
      disabled?: boolean,
      controlType?: string
    } = {}) {
    this.type = options.type;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.disabled = options.disabled;
    this.controlType = options.controlType || '';
  }
}
