import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
interface UserData {
  username: string;
  last_name:string;
  first_name:string;
  password: string;
  email: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseurl = "http://127.0.0.1:8000/api"
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient) { }
  registerNewUser(userData: UserData): Observable<any>{
    return this.http.post(this.baseurl + '/users/',
     userData);
  }
 
}