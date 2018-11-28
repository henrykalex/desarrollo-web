import { TextboxQuestion } from './question-textbox';

export const DistributorQuestions = [
  new TextboxQuestion({
    key: 'name',
    type: 'text',
    label: 'NOMBRE ALMACEN',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'legalUserName',
    type: 'text',
    label: 'GERENTE',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'rfc',
    type: 'text',
    label: 'DIRECCIÓN',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'phone',
    type: 'tel',
    label: 'TELÉFONO',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'referenceCode',
    type: 'text',
    label: 'CÓDIGO DEL QUE LO RECOMENDÓ',
    required: false,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'email',
    type: 'email',
    label: 'CORREO ELECTRÓNICO',
    required: true,
    order: 1,
  }),
];
