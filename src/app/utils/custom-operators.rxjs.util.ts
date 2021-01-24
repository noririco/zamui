import { NgZone } from '@angular/core';
import { defer, OperatorFunction, Subscription, timer, Observable, from, EMPTY, of } from 'rxjs';
import { concatMapTo, filter, finalize, groupBy, map, mergeMap, tap, toArray, withLatestFrom, switchMap, skip } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Creates an Observable that emits values only when a condition is satisfied
 * skipEmits usually helps to skip the first emit which is the default one.
 */
export function triggerObservable( sourceObservable: Observable<any>, condition: any, skipEmits?: number ) {

  const _skip = skipEmits ? skipEmits : 0;

  return sourceObservable
    .pipe(
      // tap( ( x ) => console.log( `triggerObservable: ${x}` ) ),
      skip( _skip ),
      // tap( ( x ) => console.log( `triggerObservable after skip: ${x}` ) ),
      switchMap( ( res ) => {
        if ( condition === res ) return of( true );
        else return EMPTY;
      } ) )
}
export function refreshUpon( refresher: Observable<any> ) {
  return sourceObservable => refresher.pipe( switchMap( sourceObservable ) )
}
export function unique() {
  return sourceObservable => sourceObservable.pipe( map( ( arr: any[] ) => arr.filter( ( v, i, a ) => a.indexOf( v ) === i ) ) )
}

//NOTE set this to false to stop logging
const forceDebug = false;
export let isDebugMode = forceDebug && !environment.production;
/**
 * @link https://medium.com/angular-in-depth/rxjs-whats-changed-with-sharereplay-65c098843e95
 * @param source 
 * @param name 
 * 
 * wrap other observable and log it all the way down.
 * use ctrl+k 1 for snippet obslog
 * use ctrl+k 2 for snippet tobslog
 * 
 * TODO find a way to mix it with the ConsoleLogger!
 * IMPORTANT set the debug false when building for production
 */
export const ObsLog = <T>( source: Observable<T>, name: string, debug: boolean = true ) => defer( () => {

  if ( !isDebugMode ) {
    return source;
  }

  if ( !debug ) {
    return source;
  }

  console.log( `%c (( ${name} )): subscribed`, 'background: #222; color: #bada55' );

  return source.pipe(
    tap( {
      next: value => console.log( `%c (( ${name} )): `, 'background: #222; color: #bada55', value ),
      error: error => console.log( `%c Error: `, 'background: #222; color: #db0b00', error ),
      complete: () => console.log( `%c (( ${name} )): complete`, 'background: #222; color: #bada55' )
    } ),
    finalize( () => {
      console.log( `%c (( ${name} )): unsubscribed`, 'background: #222; color: #bada55' );
    } )
  );

} );

// ^rectrig\s+(((([a-zA-Z0-9]+)(\.[a-zA-Z0-9]+)*)(\[[0-6]\](\[\d+\])?)\s*(>|<|==)\s*(\d+(\.\d+)?))(\s+(&&|\|\|)\s+((([a-zA-Z0-9]+)(\.[a-zA-Z0-9]+)*)(\[[0-6]\](\[\d+\])?)\s*(>|<|==)\s*(\d+(\.\d+)?)))*)
// if stratwith rectrig (\s+(&&|\|\|)\s+)?(([a-zA-Z0-9]+)(\.[a-zA-Z0-9]+)*)(\[[0-6]\](\[\d+\])?)?\s*(>|<|==|>=|<=|!=)\s*(\d+(\.\d+)?|(([a-zA-Z0-9]+)(\.[a-zA-Z0-9]+)*)(\[[0-6]\](\[\d+\])?)?)
/**
 * polling — Time to Ask the Server for Data Again
 * @link https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457
 * @param stream 
 * @param period 
 * @param initialDelay 
 * @example
 * polling(this.http.get('https://..'), 10000).subscribe()
 */
export function polling<T>( stream: Observable<T>, period: number, initialDelay = 0 ) {
  return timer( initialDelay, period ).pipe( concatMapTo( stream ) );
}

/**
 * filterKeyboardKey
 * @link https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457
 */
type KeyboardEventKeys = 'Escape' | 'Enter';

export function filterKeyboardKey( key: KeyboardEventKeys ) {
  return filter( ( event: KeyboardEvent ) => event.key === key );
}

/**
 * Filter Truthy only
 */
export function Truthy<T>() {
  return filter( ( value: T ) => !!value )
}

/**
 * withLatestFrom + value must be true
 * @param obsy the observable you want to truthy check
 * 
 * 
 */
export function withLatestTruthy<R, T>( obsy: Observable<T> ) {
  return ( inputObs$: Observable<R> ) => inputObs$.pipe(
    withLatestFrom( obsy ),
    filter( ( [inp, value]: [R, T] ) => !!value ),
  )
}

/**
 * 
 * @param zone 
 * @example
 * .pipe(
 *   enterZone(this.zone)
 * )
 */
export function enterZone( zone: NgZone ) {
  return <T>( source: Observable<T> ) =>
    new Observable<T>( observer =>
      source.subscribe( {
        next: ( x ) => zone.run( () => observer.next( x ) ),
        error: ( err ) => observer.error( err ),
        complete: () => observer.complete()
      } )
    );
}

/**
 * Useful for timer, interval, fromEvent(window, 'scroll')
 * @param zone 
 * @example
 * .pipe(
 *   outsideZone(this.zone)
 * )
 * 
 */
export function outsideZone<T>( zone: NgZone ) {
  return function ( source: Observable<T> ) {
    return new Observable( observer => {
      let sub: Subscription;
      zone.runOutsideAngular( () => {
        sub = source.subscribe( observer );
      } );

      return sub;
    } );
  };
}


/**
 * Group array and return array of groups
 * @param criteria 
 */
export function grouper<T>( criteria: string ): OperatorFunction<T[], T[]> {
  return inputObs$ => inputObs$.pipe(
    mergeMap( ( items: T[] ) => from( items ) ),
    groupBy( ( item: T ) => item[criteria] ),
    mergeMap( ( group ) => group.pipe( toArray() ) )
  )
}
//reusable custom operator
//
export function testReg( regex: RegExp ): OperatorFunction<string, boolean> {
  return inputObs$ => inputObs$.pipe(
    map( ( _str: string ) => regex.test( _str ) ),
  )
}

/**
 * Reusable pipe operator
 * @param key the key of the object we want to filter by
 * @param logicalExp string logical expression 
 * @returns {T[]} Filtered array
 * @example 
 * filterRegex( 'Name', '^Mark' )
 * 
 */
export function filterRegex<T, K extends keyof T>( key: K, regex: RegExp ): OperatorFunction<T[], T[]> {
  return inputObs$ => inputObs$.pipe(
    map( ( items: T[] ) => items.filter( ( ( item: T ) => {
      const str: any = ( item[key] );
      return regex.test( str )
    } ) ) ),
  )
}

/**
 * Reusable pipe operator
 * @param key the key of the object we want to filter by
 * @param logicalExp string logical expression 
 * @returns {T[]} [] Filtered array
 * @example 
 * filterLogical( 'age', '>18' )
 */
export function filterLogical<T, K extends keyof T>( key: K, logicalExp: string ): OperatorFunction<T[], T[]> {
  return inputObs$ => inputObs$.pipe(
    map( ( items: T[] ) => items.filter( ( ( item: T ) => {

      const num: any = ( item[key] );
      const match = logicalExp.match( /^(>|<|=|!=|>=|<=)([1-9][0-9]*)$/ );

      if ( match ) {

        const logical = match[1];
        const num2 = match[2];

        switch ( logical ) {
          case '>':
            return parseInt( num ) > parseInt( num2 );
          case '<':
            return parseInt( num ) < parseInt( num2 );
          case '=':
            return parseInt( num ) === parseInt( num2 );
          case '!=':
            return parseInt( num ) !== parseInt( num2 );
          case '<=':
            return parseInt( num ) <= parseInt( num2 );
          case '>=':
            return parseInt( num ) >= parseInt( num2 );

          default:
            break;
        }

      }

      return false;

    } ) ) )
  )
}