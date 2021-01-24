import { trigger, style, transition, animate, query, animateChild, group } from "@angular/animations";

const pairing = ( array ) => {
  let results = [];
  for ( let i = 0; i < array.length - 1; i++ ) {
    // This is where you'll capture that last value
    for ( let j = i + 1; j < array.length; j++ ) {
      results.push( `${array[i]} <=> ${array[j]}` );
    }
  }

  return results.join( ',' );
}
const routes = ["expert", "settings", "params", "enabledisable", "emergencystop", "digitalio", "motors"];
// const routesToTransitionStates = (_r) => {

// }
//The valid string to use for all transitions
//transitionStates = "expert <=> settings, expert <=> params, ..."
// const transitionStates = pairing( routes )
const transitionStates = "expert <=> settings,expert <=> params,expert <=> enabledisable,expert <=> emergencystop,expert <=> digitalio,expert <=> motors,settings <=> params,settings <=> enabledisable,settings <=> emergencystop,settings <=> digitalio,settings <=> motors,params <=> enabledisable,params <=> emergencystop,params <=> digitalio,params <=> motors,enabledisable <=> emergencystop,enabledisable <=> digitalio,enabledisable <=> motors,emergencystop <=> digitalio,emergencystop <=> motors,digitalio <=> motors";



//This code generates error, might be due to strict mode
// const transitionStates = routes.reduce( ( acc, v, i ) =>
//   acc.concat( routes.slice( i + 1 ).map( w => v + ' <=> ' + w ) ),
//   [] ).join( ',' );
// console.log( transitionStates );
/**
 * We use this animation for all our routes
 */
export const nsnAnim =
  trigger( 'routeAnimations', [
    transition( transitionStates, [
      style( { position: 'relative' } ),
      query( ':enter, :leave', [
        style( {
          position: 'fixed',
          height: '88vh',
          width: '96vw'
        } )
      ] ),
      query( ':enter', [
        style( { opacity: 1 } )
      ] ),
      query( ':leave', animateChild() ),
      group( [
        query( ':leave', [
          animate( '300ms ease-out', style( { opacity: 0 } ) )
        ] ),
        query( ':enter', [
          animate( '300ms ease-out', style( { opacity: 1 } ) )
        ] )
      ] ),
      query( ':enter', animateChild() ),
    ] )
  ] );