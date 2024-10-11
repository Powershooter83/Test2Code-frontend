import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  private apiUrl = 'http://65.109.96.234:8000';

  constructor(private http: HttpClient) {
  }

  getLanguages(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/languages');
  }

  getVersions(language: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/languages/version/' + language);
  }

  uploadTest(language: string, version: string, tests: string) {
    const params = new HttpParams()
      .set('lang', language)
      .set('version', version)
      .set('testcases', tests);
    
    return this.http.post<any>(this.apiUrl + '/testcases', {}, {params});
  }


}
