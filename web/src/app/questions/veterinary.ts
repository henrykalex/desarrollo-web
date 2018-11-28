import { TextboxQuestion } from './question-textbox';

export const VeterinaryQuestions = [
  new TextboxQuestion({
    key: 'name',
    type: 'text',
    label: 'NOMBRE TIENDA',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'legalUserName',
    type: 'text',
    label: 'NOMBRE GERENTE',
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
  // new TextboxQuestion({
  //   key: 'location',
  //   type: 'text',
  //   label: 'LOCALIZACIÓN',
  //   required: true,
  //   order: 1,
  // }),
  new TextboxQuestion({
    key: 'referenceCode',
    type: 'text',
    label: 'CÓDIGO DEL QUE LO RECOMENDÓ',
    required: false,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'distributorCode',
    type: 'text',
    label: 'CÓDIGO DEL ALMACEN (OPCIONAL)',
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
