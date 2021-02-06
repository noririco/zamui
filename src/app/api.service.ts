import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class ApiService {
  private baseUrl = ``;
  constructor(baseUrl: string, protected http: HttpClient) {
    this.baseUrl = baseUrl;
  }

  getAll(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  get(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  create(data): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  update(id, data): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(this.baseUrl);
  }

  // findByTitle(title): Observable<any> {
  //   return this.http.get(`${this.baseUrl}?title=${title}`);
  // }
}
