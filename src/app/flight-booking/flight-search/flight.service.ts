import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Flight } from '../../entities/flight';

@Injectable({ providedIn: 'root' })
export class FlightService {
  apiUrl = 'http://www.angular.at/api/flight';

  constructor(private http: HttpClient) {}

  find(from: string, to: string): Observable<Flight[]> {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    const params = new HttpParams().set('from', from).set('to', to);

    return this.http.get<Flight[]>(this.apiUrl, { headers, params });
  }

  findById(id: number | string): Observable<Flight> {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    const params = new HttpParams().set('id', '' + id);

    return this.http.get<Flight>(this.apiUrl, { headers, params });
  }

  save(flight: Flight): Observable<Flight> {
    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http.post<Flight>(this.apiUrl, flight, { headers });
  }
}
