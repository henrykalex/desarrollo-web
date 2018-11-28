import { TextboxQuestion } from './question-textbox';
import { DropdownQuestion } from './question-dropdown';

export const ProductRewardQuestions = [
  new TextboxQuestion({
    key: 'name',
    type: 'text',
    label: 'NOMBRE DEL PRODUCTO',
    required: true,
    order: 1,
  }),
  new DropdownQuestion({
    key: 'category',
    label: 'SECTOR DEL PRODUCTO',
    order: 1,
    options: [
      {key: 'small',value:'RAZA PEQUEÑA'},
      {key: 'size',value:'RAZA MEDIANA & GRANDE'},
      {key: 'all',value:'TODAS LAS RAZAS'},
      {key: 'client',value:'CLIENTE FINAL'},
    ]
  }),
  new TextboxQuestion({
    key: 'nutritional',
    type: 'text',
    label: 'CARACTERÍSTICAS',
    order: 1,
  }),
  new TextboxQuestion({
    key: 'presentations',
    type: 'tel',
    label: 'PRESENTACIONES DISPONIBLES',
    order: 1,
  }),
  new TextboxQuestion({
    key: 'points',
    type: 'number',
    label: 'CANTIDAD DE PUNTOS QUE CUESTA',
    required: true,
    order: 1,
  }),
];
