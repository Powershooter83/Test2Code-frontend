import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

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

}
