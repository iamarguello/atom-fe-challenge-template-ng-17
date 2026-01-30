import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Login } from '../models/login';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient);
  private api = environment.api;

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  login(user: Login) : Observable<any>{ 
    return this.http.post<any>(`${this.api}/auth/login`, user);
  }

  createUser(user: UserModel) : Observable<any>{ 
    return this.http.post<any>(`${this.api}/users`, user);
  }
}
