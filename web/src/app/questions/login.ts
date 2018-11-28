import { TextboxQuestion } from './question-textbox';

export const LoginQuestions = [
  new TextboxQuestion({
    key: 'email',
    type: 'email',
    label: 'Correo',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'password',
    type: 'password',
    label: 'Contraseña',
    required: true,
    order: 1,
  }),
];
