import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from '../models/account';
import { User } from '../models/user';
import { Shelter } from '../models/shelter';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  login(username, password) {
    // Make credentials
    const credentials = this.generateBasicAuthCredentials(username, password);
    // Send credentials as Authorization header (this is spring security convention for basic auth)
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Basic ${credentials}`,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/json'
      })
    };

    // create request to authenticate credentials
    return this.http
      .get(this.baseUrl + 'authenticate', httpOptions)
      .pipe(
        tap((res) => {
          localStorage.setItem('credentials' , credentials);
          return res;
        }),
        catchError((err: any) => {
          console.log(err);
          return throwError('AuthService.login(): Error logging in.');
        })
      );
  }

  registerUser(user) {
    return this.http.post(this.baseUrl + 'api/user/register', user)
    .pipe(
      catchError((err: any) => {
        console.log(err);
        return throwError('AuthService.register(): error registering user.');
      })
    );
  }

  registerShelter(user) {
    // create request to register a new account
    return this.http.post(this.baseUrl + 'api/shelter/register', user)
    .pipe(
      catchError((err: any) => {
        console.log(err);
        return throwError('AuthService.register(): error registering user.');
      })
    );
  }

  logout() {
    localStorage.removeItem('credentials');
  }

  checkLogin() {
    if (localStorage.getItem('credentials')) {
      return true;
    }
    return false;
  }

  generateBasicAuthCredentials(username, password) {
    return btoa(`${username}:${password}`);
  }

  getCredentials() {
    return localStorage.getItem('credentials');
  }
  // getUsername() {
  //   return localStorage.getItem()
  // }
}
