import { trigger, state, style, transition, animate } from "@angular/animations";

/**
 * This animation will force the div to grow from its top right corner smoothly
 */
export const exapndCollapse = 
  
trigger('detailExpand', [
  state('collapsed', style({height: '0px', minHeight: '0'})),
  state('expanded', style({height: '*'})),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
]);
export const exapndCollapseTranslate = 
  
trigger('detailExpandT', [
  state('collapsed', style({height: 0})),
  state('expanded', style({height: '200px'})),
  transition('expanded <=> collapsed', animate('225ms linear'))
]);

export const exapndCollapseEL = trigger(
  'detailExpand', [
    transition(':enter', [
      style({ height: '0px', minHeight: '0'}),
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ height: '*' }))
    ]),
    transition(':leave', [
      style({ height: '*' }),
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ height: '0px', minHeight: '0' }))
    ])
  ]
)

