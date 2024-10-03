import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private eventsUrl = 'http://localhost:3000/events';
  private apiUrl = 'http://localhost:3000/languages';

  constructor(private http: HttpClient) {
  }

  uploadText(text: string) {
    return this.http.post(this.eventsUrl, {text});
  }

  getLanguages(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
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
      eventsSubject.complete();
    };

    return eventsSubject.asObservable();
  }

  getVersions(language: string): Observable<string[]> {
    const versionUrl = `http://localhost:3000/language/${language}`;
    return this.http.get<string[]>(versionUrl);
  }
}
