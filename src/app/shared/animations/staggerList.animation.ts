import { trigger, state, style, transition, animate, query, stagger } from "@angular/animations";

export const staggerList =
  trigger( 'staggerListAnimation', [
    transition( '* => *', [ // each time the binding value changes
      // style({ opacity: 0, transform: 'translateY(0)' }),
      // query(':leave', [
      //   stagger(100, [
      //     animate('1s', style({ transform: 'translateY(-20px)' ,opacity: 0 }))
      //   ])
      // ], { optional: true }),
      query( ':enter', [
        style( { opacity: 0, transform: 'translate(-40px,-20px)' } ),
        stagger( 50, [
          animate( '.2s cubic-bezier(0.87, 0, 0.13, 1)', style( { transform: 'translate(0px,0px)', opacity: 1 } ) )
        ] )
      ], { optional: true } )
    ] )
  ] );
export const enterAnimation =
  trigger(
    'enterAnimation', [
    transition( '* => *', [
      query( ':enter', [
        style( { transform: 'translateX(100%)', opacity: 0 } ),
        stagger( 100, [
          // animate( '3s cubic-bezier(0.35, 0, 0.25, 1)', style( { transform: 'translateY(0px)', opacity: 1 } ) )
          animate( '200ms', style( { transform: 'translateX(0)', opacity: 1, 'overflow-x': 'hidden' } ) )
        ] )
      ], { optional: true } ),
      // query( ':leave', [
      //   style( { transform: 'translateX(0)', opacity: 1 } ),
      //   stagger( 100, [
      //     // animate( '3s cubic-bezier(0.35, 0, 0.25, 1)', style( { transform: 'translateY(0px)', opacity: 1 } ) )
      //     animate( '200ms', style( { transform: 'translateX(100%)', opacity: 0 } ) )
      //   ] )
      // ], { optional: true } ),
    ] )
  ]
  );
export const enterAnimation2 =
  trigger(
    'enterAnimation2', [
    transition( '* => *', [
      query( ':enter', [
        style( { opacity: 0 } ),
        stagger( 100, [animate( '0.5s', style( { opacity: 1 } ) )] )
      ], { optional: true }
      )
    ] )
  ]
  );

export const nsnStagger = trigger( 'nsnStaggerAnimation', [
  transition( '* => *', [ // each time the binding value changes
    query( ':leave', [
      stagger( 100, [
        animate( '0.5s', style( { opacity: 0 } ) )
      ] )
    ], { optional: true } ),
    query( ':enter', [
      style( { opacity: 0 } ),
      stagger( 100, [
        animate( '0.5s', style( { opacity: 1 } ) )
      ] )
    ], { optional: true } )
  ] )
] )