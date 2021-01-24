import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, finalize } from 'rxjs/operators';
export const genericRetryStrategy = ( {
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes = [],
  message = ''
}: {
  maxRetryAttempts?: number,
  scalingDuration?: number,
  excludedStatusCodes?: number[],
  message?: string
} = {} ) => ( attempts: Observable<any> ) => {
  return attempts.pipe(
    mergeMap( ( error, i ) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (
        retryAttempt > maxRetryAttempts ||
        excludedStatusCodes.find( e => e === error.status )
      ) {
        return throwError( error );
      }

      const retryMessage = `Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`;
      if ( message ) {
        console.warn( `${message}, ${retryMessage}` );
      } else {
        console.warn( retryMessage );
      }
      // retry after 1s, 2s, etc...
      return timer( retryAttempt * scalingDuration );
    } ),
    finalize( () => console.log( 'genericRetryStrategy done.' ) )
  );
};