import { BehaviorSubject, bindCallback, Observable, of } from "rxjs";
import { distinctUntilChanged, map, shareReplay } from "rxjs/operators";
import { excludeObjFields, isEmptyObject } from "./utils/utils";

const LDB = itemTypeName =>
  function ( v ) {
    try {
      ( window as any ).ldb.get( itemTypeName, v => {
        if ( v ) {
          // console.log( `getFromLDB async result: ${itemTypeName} : ${v}` );
        }
      } );
    } catch ( e ) {
      // console.warn( `No such item:${itemTypeName} exist in LDB`, e );
    }
  };

const LDBCallback = bindCallback( LDB );

/**
 * REVIEW Base Store solution
 * Inspired by an article of Ben Nadel @see https://www.bennadel.com/blog/3522-creating-a-simple-setstate-store-using-an-rxjs-behaviorsubject-in-angular-6-1-10.htm
 * @author Ben Nadel
 * @author NSN
 */
export class Store<StateType = any> {

  readonly state$: Observable<StateType>;
  private _state$: BehaviorSubject<StateType>;
  private _initialState: StateType;
  set initialState( initialState: StateType ) {
    this._initialState = initialState;
  }
  get initialState(): StateType {
    return this._initialState;
  }
  private cache: boolean;
  private cacheKey: string;
  private excludeKeys: Array<keyof StateType> | [];
  private excludeResetKeys: Array<keyof StateType> | [];


  public constructor( options: IStoreOptions<StateType> ) {

    this._state$ = new BehaviorSubject( options.initialState );
    this.state$ = this._state$.asObservable();

    this.initialState = options.initialState;
    this.cache = options.cache || false;
    this.excludeKeys = options.exclude || [];
    this.cacheKey = options.cacheKey || '';
    this.excludeResetKeys = options.excludeReset || [];

  }

  /**
   * Snapshot of the state
   */
  get state(): StateType {
    return this._state$.getValue();
  }

  /**
   * Sets a new state
   * @param nextState the new state to set
   * updateState is where we actually do the logic
   */
  setState( nextState: StateType ): void {
    this._state$.next( nextState );
  }

  reset( resetState?: Partial<StateType> ) {

    if ( resetState ) {

      this.updateState( resetState );

    } else if ( this.excludeResetKeys.length > 0 ) {

      const state = this.initialState as any;
      const excluded = excludeObjFields( state, this.excludeResetKeys )
      this.updateState( excluded );

    } else {

      this.updateState( this.initialState );

    }
  }

  /**
   * Load a state from a storage (external)
   * @param itemTypeName SSWStateTypes
   * @param src AllowedStorage
   * @param exclude Array of K type items to exclude from the loaded data
   * @param include Array of K type items to include in the loaded data
   */
  loadState( src: AllowedStorage = 'LocalStorage' ) {
    console.log( `loadState ${this.cacheKey}` )
    let x = null;
    switch ( src ) {
      case 'LocalStorage':
        x = this.getFromLocalStorage( this.cacheKey );
        break;
      case 'IndexedDB':
        x = this.getFromLDB( this.cacheKey );
        break;
      default:
        break;
    }

    if ( x === null ) {
      // console.warn( `WARNING: Loading empty object ${itemTypeName}` );
      return null;
    }

    return x;

  }

  /**
   * 
   * @param data our payload
   * @param itemTypeName SSWStateTypes
   * @param src AllowedStorage
   * @param exclude Array of K type items to exclude from the loaded data
   * @param include Array of K type items to include in the loaded data
   */
  cacheState( data: Partial<StateType>, src: AllowedStorage = 'LocalStorage' ) {
    // console.group( `Caching State ${itemTypeName}` );

    if ( !data ) {
      // console.warn( 'WARNING: cacheState nothing to cache' );
      return;
    }

    let dataToCache = data;

    if ( this.excludeKeys.length > 0 ) {
      // console.warn( `WARNING: ${itemTypeName} cacheState and excluding: `, exclude );
      dataToCache = excludeObjFields( data, this.excludeKeys );
    }
    // if ( include.length > 0 ) {
    //   // console.warn( `WARNING: ${itemTypeName} cacheState and including: `, include );
    //   dataToCache = includeObjFields( data, include );
    // }

    if ( isEmptyObject( dataToCache ) ) return;

    switch ( src ) {
      case 'LocalStorage':
        this.setToLocalStorage( dataToCache, this.cacheKey );
        break;
      case 'IndexedDB':
        this.setToLDB( dataToCache, this.cacheKey );
        break;
      default:
        break;
    }

    // console.groupEnd();

  }

  /**
   * @return array of K type object's keys
   */
  public arrayzer<K extends keyof StateType>( s: Partial<StateType> ): K[] {
    return Object.keys( s ) as K[];
  }

  /**
   * Helper function to create exclude/include array from a certain StateType object fields.
   * @param keys
   * @param options
   * @returns if options.allBut['K2'] => ['K1','K3' .. , 'KN']
   * @returns if keys => [...keys]
   * @returns if !keys => ['K1','K2' .. , 'KN']
   */

  //DEPRACATED NOT IN USE
  public stateFieldsArray<K extends keyof StateType>( keys?: K[], options?: { allBut: boolean } ): K[] {
    // console.group( 'stateFieldsArray' );
    let keysArray = keys;
    if ( options ) {
      // console.debug( `cacheOnly options` );
      if ( options.allBut && keys.length ) {
        const all: any = this.stateFieldsArray();
        const cacheOnly: any = this.stateFieldsArray( keys );
        const exclude = all.filter( ( k ) => cacheOnly.indexOf( k ) < 0 );
        // console.debug( `all`, all );
        // console.debug( `cacheOnly`, cacheOnly );
        // console.debug( `exclude`, exclude );

        keysArray = exclude;
      }
    } else if ( !keys ) {
      keysArray = this.arrayzer( this.state );
    } else {
      keysArray = keys;
    }

    // console.debug( keysArray );

    // console.groupEnd();

    return keysArray;
  }

  // I return the given top-level state key as a stream (will always emit the current
  // key value as the first item in the stream).
  public select<K extends keyof StateType>( key: K ): Observable<StateType[K]> {

    const selectStream: Observable<StateType[K]> = this.state$.pipe(
      map( ( state: StateType ) => {
        return state[key];
      } ),
      distinctUntilChanged()
    );

    return selectStream;
  }

  /**
   * @return a Shared stream of a given key
   * Sharing is very useful to create one streamer instead of stream for each subscription!
   */
  public selectShared<K extends keyof StateType>( key: K ): Observable<StateType[K]> {

    const selectStream: Observable<StateType[K]> = this.select( key );

    return selectStream.pipe( shareReplay( 1 ) );

  }

  // public updateState(_callback: SetStateCallback<StateType>, withLogMsg: string, saveToLocalStorageStateType: SSWStateTypes): void;
  // public updateState(_partialState: Partial<StateType>, withLogMsg: string, saveToLocalStorageStateType: SSWStateTypes): void;
  public updateState( updater: any ): void {

    const currentState = this.state;

    // If the updater is a function, then it will need the current state in order to
    // generate the next state. Otherwise, the updater is the Partial<T> object.
    // --
    // NOTE There's no need for try/catch here since the updater() function will
    // fail before the internal state is updated (if it has a bug in it). As such, it
    // will naturally push the error-handling to the calling context, which makes
    // sense for this type of workflow.
    const partialState = updater instanceof Function ? updater( currentState ) : updater;

    // If the updater function returned undefined, then it decided that no state
    // needed to be changed. In that case, just return-out.
    if ( partialState === undefined ) {
      return;
    }

    // assign the new state variable
    const nextState = Object.assign( {}, currentState, partialState );

    // cache if option is true
    // NOTE if excludeKeys has values, they will not be cached!
    if ( this.cache ) {

      const cloneNextState = Object.assign( {}, nextState );
      this.cacheState( cloneNextState );

    }

    // Setting the full state in our application
    this.setState( nextState );



  }

  /*
  ***************************************************************************************************
  *
  * EXTERNAL DATA STORAGE
  * TODO Improve working with the LocalStorage, make more validations and make it more neat
  ***************************************************************************************************
  */


  // Browser Local Storage 
  public getFromLocalStorage( itemTypeName: string ) {
    // console.debug( "Getting item from LocalStorage: ", itemTypeName );

    const x = localStorage.getItem( itemTypeName );
    if ( x ) {
      // console.log(x);
      return JSON.parse( x );
    } else {
      // console.debug( `No such item:${itemTypeName} exist in LocalStorage` );
      return null;
    }
  }

  // Browser Local Storage 
  public setToLocalStorage( item: any, itemTypeName: string ) {
    try {
      return localStorage.setItem( itemTypeName, JSON.stringify( item ) );
    } catch ( err ) {
      // console.group( "Store -> setToLocalStorage ERROR" );
      console.error( "Cannot set in local storage", err );
      // console.groupEnd();
    }
  }

  //Chrome IndexedDB
  public getFromLDB( itemTypeName: string ): Observable<any> {
    // console.debug( "getFromLDB: ", itemTypeName );
    if ( ( window as any ).ldb ) {
      return LDBCallback();
    } else {
      return of( null );
    }
  }

  //Chrome IndexedDB
  public setToLDB( item: any, itemTypeName: string ) {
    // console.debug('Setting item in LocalStorage: ',itemName);
    if ( ( window as any ).ldb ) {
      // console.log((window as any).ldb);
      try {
        // console.log( "setToLDB itemTypeName: ", itemTypeName );
        ( window as any ).ldb.set( itemTypeName.toString(), JSON.stringify( item ) );
      } catch ( err ) {
        // console.group( "Store -> setToLDB ERROR" );
        // console.error( "Cannot set in LDB", err );
        // console.groupEnd();
      }
    }
  }


}


/**
 * REVIEW The prefered way to create a Statefull Service with a Store solution
 * 
 * @example
 * export class SomeService extends StoredService<ISomeServiceState> implements OnDestroy {
 *  
 * 
 *   constructor(
 *     private _zone: NgZone, <--- Important for Update method -- change detection
 *      ... other services
 *   ) {
 *
 *     super( {
 *       initialState: { <--- ISomeServiceState object - Mandatory to have at least one field
 *          field1: true,
 *          field2: 'ServiceStateFieldValue'
 *       },
 *       cache: true,
 *       cacheKey: 'STORAGE_KEY',
 *       exclude: ['dontCacheFieldKey', 'dontCacheField2Key', ..],
 *       excludeReset: ['dontResetMeWhenUsingStoreReset()', 'youGotThePoint', ..]
 *     } );
 *  }
 * 
 *  ...
 *  
 * }
 * 
 * 
 */
export abstract class StoredService<T> {
  public store: Store<T>;
  constructor( options: IStoreOptions<T> ) {
    this.store = new Store<T>( options );
  }

  /**
   * TODO find a way to use zone from the store itself, then it is possible to remove this Update method
   * Creating Update wrapper function is a must since we have to use zone.run()
   */
  public abstract Update( partial: Partial<T> ): void;

  /**
   * reset method wrapper is needed when we want to reset multiple StoredService objects
   * @example
   * private disconnectionReset() {
   *  this.logger.log( `Reseting all resetables..` );
   *  this.servicesToReset.forEach( s => s.reset() );
   * }
   */
  protected reset( partial?: Partial<T> ): void {
    this.store.reset( this.store.initialState );
  }

  /**
   * Loads the cached state from the storage and updates the state object
   * It is important when we want to presist information after refresh/reload/moving between pages/ 
   */
  protected loadCachedState(): void {
    const cachedState: Partial<T> = this.store.loadState();
    if ( cachedState ) {
      this.Update( cachedState );
    }
  }
}

export interface IStoreOptions<T> {
  initialState: T;
  cache?: boolean;
  cacheKey?: string;
  exclude?: Array<keyof T>;
  excludeReset?: Array<keyof T>;
}

export interface IStoredService<T> {
  store: Store<T>;
  Update( partial: Partial<T> ): void;
  reset( payload?: Partial<T> | boolean ): void;
  loadCachedState(): void;
}

//add more options in when needed
type AllowedStorage = 'LocalStorage' | 'IndexedDB';

// When updating the state, the caller has the option to define the new state partial
// using a a callback. This callback will provide the current state snapshot.
interface SetStateCallback<T> {
  ( currentState: T ): Partial<T> | undefined;
}

interface IDictionary<TValue> {
  [id: string]: TValue;
}


