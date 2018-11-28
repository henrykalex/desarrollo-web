import { TextboxQuestion } from './question-textbox';

export const DistributorReferenceQuestions = [
  new TextboxQuestion({
    key: 'name',
    type: 'text',
    label: 'Nombre completo',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'phone',
    type: 'tel',
    label: 'Teléfono',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'relationship',
    type: 'text',
    label: 'Parentesco',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'address',
    type: 'text',
    label: 'Domicilio',
    required: true,
    order: 1,
  }),
];
