import { TextboxQuestion } from './question-textbox';
import { DropdownQuestion } from './question-dropdown';

export const ProductQuestions = [
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
    required: true,
    order: 1,
    options: [
      {key: 'home',value:'HOGAR'},
      {key: 'coucine',value:'COCINA'},
      {key: 'bathroom',value:'BAÑO'},
      {key: 'room',value:'CUARTO'},
    ]
  }),
  new TextboxQuestion({
    key: 'characteristics',
    type: 'text',
    label: 'CARACTERÍSTICAS',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'presentations',
    type: 'tel',
    label: 'PRESENTACIONES DISPONIBLES',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'points',
    type: 'number',
    label: 'CANTIDAD DE PUNTOS QUE DA',
    required: true,
    order: 1,
  }),
  new TextboxQuestion({
    key: 'cost',
    type: 'currency',
    label: 'PRECIO',
    required: true,
    order: 1,
  }),
];
