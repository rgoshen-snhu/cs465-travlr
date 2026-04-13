import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { BROWSER_STORAGE } from '../storage';
import { AuthResponse } from '../models/auth-response';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { }

  // Setup our API URLs
  baseUrl = 'http://localhost:3000/api/trips';
  authUrl = 'http://localhost:3000/api';

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.baseUrl);
  }

  addTrip(formData: Trip): Observable<Trip[]> {
    return this.http.post<Trip[]>(this.baseUrl, formData);
  }

  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/${tripCode}`);
  }

  editTrip(formData: Trip): Observable<Trip[]> {
    return this.http.put<Trip[]>(`${this.baseUrl}/${formData.code}`, formData);
  }

  // Call to our /login endpoint, returns JWT
  public login(user: User, password: string): Observable<AuthResponse> {
    console.log('Inside TripDataService::login');
    return this.handleAuthApiCall('login', user, password);
  }

  // Call to our /register endpoint, creates user and returns JWT
  public register(user: User, password: string): Observable<AuthResponse> {
    console.log('Inside TripDataService::register');
    return this.handleAuthApiCall('register', user, password);
  }

  // helper method to process both login and register methods
  private handleAuthApiCall(endpoint: string, user: User, password: string): Observable<AuthResponse> {
    console.log('Inside TripDataService::handleAuthAPICall');
    let formData = {
      name: user.name,
      email: user.email,
      password: password
    };
    return this.http.post<AuthResponse>(`${this.authUrl}/${endpoint}`, formData);
  }
}
