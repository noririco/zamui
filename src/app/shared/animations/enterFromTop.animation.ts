import { trigger, state, style, transition, animate } from "@angular/animations";

/**
 * This animation will force the div to grow from its top right corner smoothly
 */
export const enterFromTop = 
  
trigger('enterFromTop', [
  transition(':enter', [
    style({ transform: "{{from}}", opacity: 0 }),
    animate('{{time}} cubic-bezier(0.4, 0.0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1  })),
  ], { params: { from: 0, time: '3s'} }),
  transition(':leave', [
    animate('1s cubic-bezier(0.4, 0.0, 0.2, 1)', style({ transform: 'translateY(-100%)', opacity: 0 }))
  ])
]);
// trigger('enterFromTop', [
//   transition(':enter', [
//     style({ transform: 'translateY(-100%)', opacity: 0 }),
//     animate('3s cubic-bezier(0.4, 0.0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1  })),
//   ], { params: { from: 0 } }),
//   transition(':leave', [
//     animate('3s cubic-bezier(0.4, 0.0, 0.2, 1)', style({ transform: 'translateY(-100%)', opacity: 0 }))
//   ])
// ]);
// trigger('enterFromTop', [
//   state('hide', style({height: '0px', minHeight: '0'})),
//   state('show', style({height: '*'})),
//   transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
// ]);



