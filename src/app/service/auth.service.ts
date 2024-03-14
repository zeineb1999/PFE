import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string) : Observable<any>{
    return this.http.post<any>('http://127.0.0.1:8000/api/api/token/', { username, password });
  }
  logout() {
    // Supprimez le token JWT stocké côté client
    localStorage.removeItem('token');
  }

  getToken() {
    // Récupérez le token JWT stocké côté client
    return localStorage.getItem('token');
  }
 
    
  
  getProfile() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>('http://127.0.0.1:8000/api/profile/', { headers });
  }
  updateUserProfile(newUsername: string, newFirstname: string, newLastname: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { username: newUsername, first_name: newFirstname, last_name: newLastname };
    return this.http.put<any>('http://127.0.0.1:8000/api/profile/', body, { headers });
  }
  
}
