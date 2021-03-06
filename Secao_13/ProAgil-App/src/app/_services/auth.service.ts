import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = 'http://localhost:5000/api/user/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  
  constructor(private http: HttpClient) { }

  login(model: User) {
    return this.http.post(`${this.baseURL}Login`, model).pipe(
      map((response: any) => {
        const user = response;
        if(user)
        {
          localStorage.setItem('token', user.token);
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          sessionStorage.setItem('userName', this.decodedToken.unique_name)
        }
      })
    );
  }

  getUserName() : string {
    const userName = sessionStorage.getItem('userName');
    return userName;
  }

  register(model: User) {
      return this.http.post(`${this.baseURL}Register`, model);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('token');
  }
}
