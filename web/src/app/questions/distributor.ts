import { TextboxQuestion } from './question-textbox';

export const DistributorQuestions = [
  new TextboxQuestion({
    key: 'name',
    type: 'text',
    label: 'EMPRESA',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'legalUserName',
    type: 'text',
    label: 'REPRESENTANTE LEGAL',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'rfc',
    type: 'text',
    label: 'RFC',
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
    label: 'Código del que lo recomendó',
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
