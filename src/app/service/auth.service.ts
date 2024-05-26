import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string) : Observable<any>{
    return this.http.post<any>('http://127.0.0.1:8000/api/api/token/', { username, password });
  }
  getId(username: string) : Observable<any>{
    const url = `http://127.0.0.1:8000/api/getId/${username}`;
    return this.http.get<any>(url);
  }
  logout() {
    // Supprimez le token JWT stocké côté client
    sessionStorage.removeItem('isLoggedIn');
    localStorage.clear();
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('id');
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  getToken() {
    // Récupérez le token JWT stocké côté client
    return sessionStorage.getItem('token');
  }

  getProfile() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>('http://127.0.0.1:8000/api/profile/', { headers });
  }
  getAllusers() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>('http://127.0.0.1:8000/api/Allusers/', { headers });
  }
  getRole(user_Id : number) {
   
    const url = `http://127.0.0.1:8000/api/getRole/${user_Id}`;
    return this.http.get<any>(url);
  }
  sendCode(email:string,code: number): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/modificationProfile/', { email ,code});

  }
  deleteUser(id: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`http://127.0.0.1:8000/api/deleteUser/${id}`, { headers });
  }
  updateUserProfile(newUsername: string, newFirstname: string, newLastname: string,newEmail:string) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { username: newUsername, firstname: newFirstname, lastname: newLastname, email:newEmail };
    return this.http.put<any>('http://127.0.0.1:8000/api/profile/', body, { headers });
  }
  public resetPassword(email: string, code: number): Observable<any> {
    
    return this.http.post<any>('http://127.0.0.1:8000/api/send-reset-password-email/', { email });
  }
  

  //return this.http.post<any>('http://127.0.0.1:8000/api/ChangePassword/', { email,password});
  
  public changerPassword(uidb64: string, token: string, newPassword: string): Observable<any> {
    // Envoyer uidb64, token et nouveau mot de passe au backend pour réinitialisation
    const url = `http://127.0.0.1:8000/api/reset_password_avec_uid/${uidb64}/${token}/`;
    return this.http.post<any>(url, { newPassword });
  }

  
}