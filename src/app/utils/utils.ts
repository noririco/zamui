/* eslint-disable prefer-rest-params */
/* eslint-disable no-prototype-builtins */
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { NgZone } from '@angular/core';


export function randomIntFromInterval( min, max ) { // min and max included 
  return Math.floor( Math.random() * ( max - min + 1 ) + min );
}
export function isUndefined( something: any ): boolean {
  // if(something == undefined) console.warn("Undefined has found!");
  return something == undefined;
}

export function isJSON( test: any ): boolean {
  try {
    JSON.parse( test );
    return true;
  } catch ( err ) {
    console.debug( "The item you tried to parse is not JSON", err );
    return false;
  }
}

export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : ( r & 0x3 | 0x8 );
    return v.toString( 16 );
  } );
}

export function makeid( length ): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt( Math.floor( Math.random() * charactersLength ) );
  }
  return result;
}

export function isQuotaExceeded( e ): boolean {
  let quotaExceeded = false;
  if ( e ) {
    if ( e.code ) {
      switch ( e.code ) {
        case 22:
          quotaExceeded = true;
          break;
        case 1014:
          // Firefox
          if ( e.name === "NS_ERROR_DOM_QUOTA_REACHED" ) {
            quotaExceeded = true;
          }
          break;
      }
    } else if ( e.number === -2147024882 ) {
      // Internet Explorer 8
      quotaExceeded = true;
    }
  }
  return quotaExceeded;
}

export function testRegexs( str: string, regexs: RegExp[] ): boolean {

  if ( !str || regexs.length < 1 ) return;

  for ( let i = 0; i < regexs.length; i++ ) {
    if ( str.match( regexs[i] ) ) {
      return true;
    }
  }

  return false;
}

export function isEmptyObject( obj ): boolean {
  return Object.keys( obj ).length === 0 && obj.constructor === Object
}
export function eventPP( event: MouseEvent ): MouseEvent {
  if ( !isUndefined( event ) && event ) {
    // event.preventDefault();
    event.stopPropagation();
  } else {
    console.warn( "Trying to precent default and stop propogation failed!" );
  }
  return event;
}
/**
 * NOTE https://netbasal.com/optimizing-angular-change-detection-triggered-by-dom-events-d2a3b2e11d87
 * @param zone 
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
export function enterZone<T>( zone: NgZone ) {
  return function ( source: Observable<T> ) {
    return new Observable<T>( observer => {
      let sub: Subscription;
      zone.run( () => {
        sub = source.subscribe( observer );
      } );

      return sub;
    } );
  };
}

export function compareObjects( o1: any, o2: any ): boolean {
  return JSON.stringify( o1 ) === JSON.stringify( o2 );
}
/**
 *
 * @param promises a list of async functions
 * @example
 * const asyncFunctions = [
 *    () => this.task1(),
 *    () => this.task2(),
 *    () => this.task3()
 *      ...
 *  ];
 *
 * @returns
 * all promises 1 by 1
 * like:
 * @example
 * this.task1().then(() =>
 *      this.task2().then(() =>
 *            this.task3()))
 */
export async function chainPromises( promises ) {
  for ( const promise of promises ) {
    await promise();
  }
}
/**
 * excludes fields from a given obj
 *
 */
export function excludeObjFields( obj: object, excludeKeys: any[] ) {
  const o = { ...obj };
  excludeKeys.forEach( ek => delete o[ek] );
  return o;
}
/**
 * excludes fields from a given obj
 *
 */
export function includeObjFields( obj: object, includeKeys: any[] ) {
  const o = { ...obj };
  includeKeys.forEach( ek => ( o[ek] = null ) );
  return o;
}

export function isEqual( value, other ) {


  // Get the value type
  const type = Object.prototype.toString.call( value );

  // If the two objects are not the same type, return false
  if ( type !== Object.prototype.toString.call( other ) ) return false;

  // If items are not an object or array, return false
  if ( ['[object Array]', '[object Object]'].indexOf( type ) < 0 ) return false;

  // Compare the length of the length of the two items
  const valueLen = type === '[object Array]' ? value.length : Object.keys( value ).length;
  const otherLen = type === '[object Array]' ? other.length : Object.keys( other ).length;
  if ( valueLen !== otherLen ) return false;

  // Compare two items
  const compare = function ( item1, item2 ) {

    // Get the object type
    const itemType = Object.prototype.toString.call( item1 );

    // If an object or array, compare recursively
    if ( ['[object Array]', '[object Object]'].indexOf( itemType ) >= 0 ) {
      if ( !isEqual( item1, item2 ) ) return false;
    }

    // Otherwise, do a simple comparison
    else {

      // If the two items are not the same type, return false
      if ( itemType !== Object.prototype.toString.call( item2 ) ) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if ( itemType === '[object Function]' ) {
        if ( item1.toString() !== item2.toString() ) return false;
      } else {
        if ( item1 !== item2 ) return false;
      }

    }
  };

  // Compare properties
  if ( type === '[object Array]' ) {
    for ( let i = 0; i < valueLen; i++ ) {
      if ( compare( value[i], other[i] ) === false ) return false;
    }
  } else {
    for ( const key in value ) {
      if ( value.hasOwnProperty( key ) ) {
        if ( compare( value[key], other[key] ) === false ) return false;
      }
    }
  }

  // If nothing failed, return true
  return true;


}

export function deepCompare( x, y ) {
  let i, l, leftChain, rightChain;

  function compare2Objects( x, y ) {
    let p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if ( isNaN( x ) && isNaN( y ) && typeof x === 'number' && typeof y === 'number' ) {
      return true;
    }

    // Compare primitives and functions.     
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if ( x === y ) {
      return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ( ( typeof x === 'function' && typeof y === 'function' ) ||
      ( x instanceof Date && y instanceof Date ) ||
      ( x instanceof RegExp && y instanceof RegExp ) ||
      ( x instanceof String && y instanceof String ) ||
      ( x instanceof Number && y instanceof Number ) ) {
      return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if ( !( x instanceof Object && y instanceof Object ) ) {
      return false;
    }

    if ( x.isPrototypeOf( y ) || y.isPrototypeOf( x ) ) {
      return false;
    }

    if ( x.constructor !== y.constructor ) {
      return false;
    }

    if ( x.prototype !== y.prototype ) {
      return false;
    }

    // Check for infinitive linking loops
    if ( leftChain.indexOf( x ) > -1 || rightChain.indexOf( y ) > -1 ) {
      return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for ( p in y ) {
      if ( y.hasOwnProperty( p ) !== x.hasOwnProperty( p ) ) {
        return false;
      }
      else if ( typeof y[p] !== typeof x[p] ) {
        return false;
      }
    }

    for ( p in x ) {
      if ( y.hasOwnProperty( p ) !== x.hasOwnProperty( p ) ) {
        return false;
      }
      else if ( typeof y[p] !== typeof x[p] ) {
        return false;
      }

      switch ( typeof ( x[p] ) ) {
        case 'object':
        case 'function':

          leftChain.push( x );
          rightChain.push( y );

          if ( !compare2Objects( x[p], y[p] ) ) {
            return false;
          }

          leftChain.pop();
          rightChain.pop();
          break;

        default:
          if ( x[p] !== y[p] ) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  if ( arguments.length < 1 ) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for ( i = 1, l = arguments.length; i < l; i++ ) {

    leftChain = []; //Todo: this can be cached
    rightChain = [];

    if ( !compare2Objects( arguments[0], arguments[i] ) ) {
      return false;
    }
  }

  return true;
}

/**
 * Compares two arrays after sorting them.
 * @param a string[] | number[]
 * @param b string[] | number[]
 * @example
 * let a = [3,2,1];
 * let b = [2,1,3];
 * let isEqualElements = compareArrays(a,b);
 * //isEqualElements true
 *
 * @returns boolean
 */
export function compareArrays( a: number[], b: number[] ): boolean;
export function compareArrays( a: string[], b: string[] ): boolean;
export function compareArrays( a: any[], b: any[] ): boolean {
  return JSON.stringify( a.sort() ) === JSON.stringify( b.sort() );
}


export function compareArraysNoSort( a: any[], b: any[] ) {
  return JSON.stringify( a ) === JSON.stringify( b );
}
export const AlphabetComperator = sortByField => ( a, b ) => {
  const al = a[sortByField].toLowerCase();
  const bl = b[sortByField].toLowerCase();
  if ( al > bl ) return 1;
  if ( al < bl ) return -1;
  return 0;
};

export const zipArray = ( arr1, arr2 ) => arr1.map( ( k, i ) => [k, arr2[i]] );
export const mergeArray = ( arr ) => [].concat( ...arr );
/**
 * Will find the csvdata part and clean it so we can parse it correctly
 * this is due to the not stringified csv string we are getting in the object
 * @param rec the string to fix
 * @returns {string} final fixed csv string
 */
export function pluckCSVFromRecord( rec: string ): string {
  // console.log(rec);
  let final = rec.trim();
  const split = rec.split( 'csvdata":"' );
  if ( split.length > 1 ) {
    // console.log(split);
    const recFix = split[1].replace( '"}}', "" );
    final = recFix.trim();
  }
  return final;
}


export function convertDecToHexString( decimal: string ): string {
  // console.log("convertDecToHexString > ", decimal, "=====>", parseInt(decimal).toString(16));
  return parseInt( decimal ).toString( 16 );
}



export function sortStartWithAlphabet( a: any[], searchStr: string, searchOnKey: string ) {
  const first = [];
  const others = [];
  for ( let i = 0; i < a.length; i++ ) {
    const item = a[i][searchOnKey].toLowerCase();
    if ( item.indexOf( searchStr ) == 0 ) {
      first.push( a[i] );
    } else if ( item.indexOf( searchStr ) > 0 ) {
      others.push( a[i] );
    }
  }
  first.sort();
  others.sort();
  return first.concat( others );
}

/**
 *
 * Will fix array indexing when pushing and removing new items
 * so it will always stay in order
 */
export function fixArrayIndexPosition( d: any[], field: string ) {
  let pos = 1;
  d.forEach( element => {
    element[field] = pos++;
  } );
  return d;
}

export function eliminateDuplicates( arr, key?) {
  if ( key ) {
    return arr.filter( ( thing, index, self ) => self.findIndex( t => t[key] === thing[key] ) === index );
  } else return arr.filter( ( thing, index, self ) => self.findIndex( t => t === thing ) === index );
}
export function eliminateCopys( arr, key?) {
  if ( key ) {
    return arr.filter( ( thing, index, self ) => self.findIndex( t => t[key] != thing[key] + "(cpy)" ) === index );
  } else return arr.filter( ( thing, index, self ) => self.findIndex( t => t != thing + "(cpy)" ) === index );
}
export function fixNameDuplicates( arr, key?) {
  const out = arr;

  if ( key ) {
    arr.forEach( ( a, i ) => {
      arr.forEach( ( b, j ) => {
        // console.log(a[key],b[key]);

        if ( i != j && a[key] == b[key] && i < j ) {
          out[j][key] = a[key] + "(cpy)";
        }
      } );
    } );
  } else {
    arr.forEach( ( a, i ) => {
      arr.forEach( ( b, j ) => {
        // console.log(a,b);

        if ( i != j && a == b && i < j ) {
          out[j] = a + "(cpy)";
        }
      } );
    } );
  }

  return out;
}
export function fixNameDuplicates2( arr, key?) {
  const out = arr;

  if ( key ) {
    arr.forEach( ( a, i ) => {
      let count = 1;
      arr.forEach( ( b, j ) => {
        // console.log(a[key],b[key]);

        if ( i != j && a[key] == b[key] && i < j ) {
          out[j][key] = `${a[key]}(${count})`;
          count++;
        }
      } );
    } );
  } else {
    arr.forEach( ( a, i ) => {
      let count = 1;
      arr.forEach( ( b, j ) => {
        // console.log(a,b);

        if ( i != j && a == b && i < j ) {
          out[j] = `${a}(${count})`;
          count++;
        }
      } );
    } );
  }

  return out;
}

export function copyToClipboard( val: string ): void {
  const selBox = document.createElement( "textarea" );
  selBox.style.position = "fixed";
  selBox.style.left = "0";
  selBox.style.top = "0";
  selBox.style.opacity = "0";
  selBox.value = val;
  document.body.appendChild( selBox );
  selBox.focus();
  selBox.select();
  document.execCommand( "copy" );
  document.body.removeChild( selBox );
}

export function arrayMoveIndex( arr, oldIndex, newIdex ): any[] {
  if ( newIdex >= arr.length ) {
    let k = newIdex - arr.length + 1;
    while ( k-- ) {
      arr.push( undefined );
    }
  }
  arr.splice( newIdex, 0, arr.splice( oldIndex, 1 )[0] );
  return arr;
}
