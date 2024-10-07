import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, Subject, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private readonly baseUrl = 'http://localhost:3000';
  private readonly eventsUrl = `${this.baseUrl}/events`;
  private readonly apiUrl = `${this.baseUrl}/languages`;

  constructor(private http: HttpClient) {
  }

  uploadText(text: string): Observable<any> {
    return this.http.post(this.eventsUrl, {text}).pipe(
      catchError(this.handleError)
    );
  }

  getLanguages(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  listenToEvents(): Observable<any> {
    const eventSource = new EventSource(this.eventsUrl);
    const eventsSubject = new Subject<any>();

    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      eventsSubject.next(eventData);

      if (eventData.isLast) {
        eventSource.close();
        eventsSubject.complete();
      }
    };

    eventSource.onerror = (error) => {
      eventSource.close();
      eventsSubject.error(error);
    };

    return eventsSubject.asObservable();
  }

  getVersions(language: string): Observable<string[]> {
    const versionUrl = `${this.baseUrl}/language/${language}`;
    return this.http.get<string[]>(versionUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }
}
