import { trigger, state, style, transition, animate, query } from "@angular/animations";



/**
 * This animation will force the div to grow from its top right corner smoothly
 */
export const openCloseTopRight = trigger( "openCloseTopRight", [
  state(
    "open",
    style( {
      "transform-origin": "top right",
      height: "auto",
      width: "auto",
      opacity: 1
    } )
  ),
  state(
    "closed",
    style( {
      "transform-origin": "top right",
      height: "0px",
      width: "0px",
      opacity: 0
    } )
  ),
  transition( "open => closed", [
    animate(
      "0.75s cubic-bezier(0.35, 0, 0.25, 1)",
      style( { transform: "scale3d(0, 0, 0)", opacity: 0 } )
    )
  ] ),
  transition( "closed => open", [
    style( { transform: "scale3d(.3, .3, .3)" } ),
    animate( "0.5s cubic-bezier(0.35, 0, 0.25, 1)" )
  ] )
] );
export const openCloseTopBottom = trigger( "openCloseTopBottom", [
  state(
    "open",
    style( {
      "transform-origin": "top",
      height: "*"
    } )
  ),
  state(
    "closed",
    style( {
      "transform-origin": "top",
      height: "0px"
    } )
  )
] );
export const fadeInOut = trigger( "fadeInOut", [
  transition(
    ":enter",
    [
      style( { opacity: 0 } ),
      animate( ".8s .7s cubic-bezier(0.4, 0.0, 0.2, 1)", style( { opacity: 1 } ) )
    ],
    { params: { from: 0, time: "3s" } }
  ),
  transition( ":leave", [animate( "200ms cubic-bezier(0.4, 0.0, 0.2, 1)", style( { opacity: 0 } ) )] )
] );

export const fadeInOut2 = trigger( "fadeInOut2", [
  transition( '* => *', [ // each time the binding value changes

    query(
      "img[src]",
      [
        style( { opacity: 0 } ),
        animate( ".2s .5s cubic-bezier(0.4, 0.0, 0.2, 1)", style( { opacity: 1 } ) )
      ],
      {
        // params: { from: 0, time: "3s" },
        optional: true
      }
    )
  ] )
  // transition( ":leave", [animate( "200ms cubic-bezier(0.4, 0.0, 0.2, 1)", style( { opacity: 0 } ) )] )
] );

//{ value: ':enter', params: { from: 'translateY(-100%)', time: '3s', delay: '1s' } }
// export const fadeInOutOverlay = trigger( "fadeInOut", [
//   transition(
//     ":enter",
//     [
//       style( { transform: 'translateY(-20%)', opacity: 0 } ),
//       animate( "200ms cubic-bezier(0.4, 0.0, 0.2, 1)", style( { transform: 'translateY(0)', opacity: 1 } ) )
//     ],
//     { params: { from: 0, time: "0.3s" } }
//   ),
//   transition( ":leave", [animate( "200ms cubic-bezier(0.4, 0.0, 0.2, 1)", style( { transform: 'scale(0)', opacity: 0 } ) )] )
// ] );
export const fadeInOutOverlay = trigger( "fadeInOut", [
  transition(
    ":enter",
    [
      style( { transform: '{{from}}', opacity: 0 } ),
      animate( "{{time}} {{delay}} cubic-bezier(0.4, 0.0, 0.2, 1)", style( { transform: 'translateY(0)', opacity: 1 } ) )
    ],
    { params: { from: 'translateY(-20%)', time: '0.2s', delay: '0s' } }
  ),
  transition( ":leave", [animate( "300ms {{delay}} cubic-bezier(0.4, 0.0, 0.2, 1)", style( { transform: 'translateY(-50%) scale(0.3)', opacity: 0 } ) )] )
] );

export const routefadeAnimation =

  trigger( 'fadeAnimation', [

    transition( '* => *', [

      query( ':enter',
        [
          style( { opacity: 0 } )
        ],
        { optional: true }
      ),

      query( ':leave',
        [
          style( { opacity: 1, position: 'absolute' } ),
          animate( '0.1s ease-in-out', style( { opacity: 0 } ) )
        ],
        { optional: true }
      ),

      query( ':enter',
        [
          style( { opacity: 0 } ),
          animate( '0.1s ease-in-out', style( { opacity: 1 } ) )
        ],
        { optional: true }
      )

    ] )

  ] );

export const fader =
  trigger( `fader`, [
    state( 'fadin', style( { opacity: 1 } ) ),
    state( 'fadout', style( { opacity: 0.1 } ) ),
    transition( 'fadin <=> fadout', animate( `200ms linear` ) ),
  ] );

  //animateChild
  //query('.item') 