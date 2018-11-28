import { TextboxQuestion } from './question-textbox';

export const ClientQuestions = [
  new TextboxQuestion({
    key: 'name',
    type: 'text',
    label: 'NOMBRE Y APELLIDO',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'petName',
    type: 'text',
    label: 'NOMBRE DE LA MASCOTA',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'petBreed',
    type: 'text',
    label: 'RAZA',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'referenceCode',
    type: 'text',
    label: 'CÓDIGO DEL USUARIO QUE LO RECOMENDÓ',
    required: false,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'veterinaryCode',
    type: 'text',
    label: 'CÓDIGO DEL VETERINARIO (OPCIONAL)',
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
