import { NgZone } from '@angular/core';
import { from, Observable, OperatorFunction, Subscription, MonoTypeOperatorFunction, timer, defer } from 'rxjs';
import { groupBy, map, mergeMap, toArray, first, filter, concatMapTo, tap, finalize, switchMap, concatMap } from 'rxjs/operators';


function consoleLogColorTest() {
  console.log( `\x1b[47m ${name}: subscribed` );
  console.log( `\x1b[46m ${name}: subscribed` );
  console.log( `\x1b[45m ${name}: subscribed` );
  console.log( `\x1b[44m ${name}: subscribed` );
  console.log( `\x1b[43m ${name}: subscribed` );
  console.log( `\x1b[42m ${name}: subscribed` );
  console.log( `\x1b[41m ${name}: subscribed` );
  console.log( `\x1b[40m ${name}: subscribed` );
  console.log( `\x1b[36m ${name}: subscribed` );
  console.log( `\x1b[35m ${name}: subscribed` );
  console.log( `\x1b[34m ${name}: subscribed` );
  console.log( `\x1b[33m ${name}: subscribed` );
  console.log( `\x1b[32m ${name}: subscribed` );
  console.log( `\x1b[32m ${name}: subscribed` );
  console.log( `\x1b[31m ${name}: subscribed` );
  console.log( `\x1b[30m ${name}: subscribed` );
  console.log( `\x1b[208m ${name}: subscribed` );
}


// consoleLogColorTest();
/**
 * @link https://medium.com/angular-in-depth/rxjs-whats-changed-with-sharereplay-65c098843e95
 * @param source 
 * @param name 
 */
export const ObsLog = <T>( source: Observable<T>, name: string ) => defer( () => {
  console.group( `%c ${name}: subscribed`, 'background: #222; color: #bada55' );
  console.log( `%c ${name}: subscribed`, 'background: #222; color: #bada55' );

  return source.pipe(
    tap( {
      next: value => console.log( `%c ${name}: `, 'background: #222; color: #bada55', value ),
      error: error => console.log( `%c Error: `, 'background: #222; color: #db0b00', error ),
      complete: () => console.log( `%c ${name}: complete`, 'background: #222; color: #bada55' )
    } ),
    finalize( () => {
      console.log( `%c ${name}: unsubscribed`, 'background: #222; color: #bada55' );
      console.groupEnd();
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
 * @link https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457
 */
export function Truthy() {
  return filter( value => value !== undefined && value !== null )
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
export function grouper<T>( criteria: string ): OperatorFunction<any, any> {
  return inputObs$ => inputObs$.pipe(
    // mergeMap( ( item ) => item ),
    groupBy( ( item: any ) => item[criteria] ),
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