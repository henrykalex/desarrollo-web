import { TextboxQuestion } from './question-textbox';

export const AddressQuestions = [
  new TextboxQuestion({
    key: 'street',
    type: 'text',
    label: 'Calle',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'number',
    type: 'text',
    label: 'Número',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'country',
    type: 'text',
    label: 'País',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'postalcode',
    type: 'text',
    label: 'Código postal',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'state',
    type: 'text',
    label: 'Estado',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'city',
    type: 'text',
    label: 'Ciudad',
    required: true,
    order: 1,
  }),

];
