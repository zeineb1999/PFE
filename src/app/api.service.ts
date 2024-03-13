import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseurl = "http://127.0.0.1:8000/api"
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient) { }
  getALLMovies(): Observable<any>{
    return this.http.get(this.baseurl + '/movies/',
     {headers: this.httpHeaders});
  }
  getOneMovie(id: number): Observable<any>{
    return this.http.get(this.baseurl + '/movies/'+id+'/' ,
     {headers: this.httpHeaders});
  }

  updateMovie(movie: { id: number, title: string, desc: string, year: number }): Observable<any>{
    const body = { title: movie.title, desc: movie.desc, year: movie.year }
    return this.http.put(this.baseurl + '/movies/'+movie.id+'/', body, {headers: this.httpHeaders});
  } 
  createMovie(movie: { id: number, title: string, desc: string, year: number }): Observable<any>{
    const body = { title: movie.title, desc: movie.desc, year: movie.year }
    return this.http.post(this.baseurl + '/movies/', body, {headers: this.httpHeaders});
  } 
  deleteMovie(id: number): Observable<any>{
     return this.http.delete(this.baseurl + '/movies/'+id+'/', {headers: this.httpHeaders});
  }
  getAllEtages() : Observable<any>{
    return this.http.get(this.baseurl + '/etage/',
     {headers: this.httpHeaders});
  }
  addZone(zone:{  nomLocal: string, typeLocal: string, etageZ: number }) : Observable<any>{
    const body = {  nomlocal: zone.nomLocal, typeLocal:zone.typeLocal, etageZ: zone.etageZ}
    return this.http.post(this.baseurl + '/zones/', body,{headers: this.httpHeaders});
  }
 




  addFloor(surface: number) {
    return this.http.post(this.baseurl + '/etage/', { surface },{headers: this.httpHeaders});
  }
}

  

