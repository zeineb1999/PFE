import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FloorService {
  private baseurl = "http://127.0.0.1:8000/api";
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getAllEtages(): Observable<any> {
    return this.http.get(`${this.baseurl}/etage/`, { headers: this.httpHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  ajouterZone(nomLocal: string, typeLocal: string, etageId: number): Observable<any> {
    const zoneData = {
      nomLocal: nomLocal,
      typeLocal: typeLocal,
      etageZ: etageId
    };
    return this.http.post(this.baseurl + '/zones/', zoneData);
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    throw error;
  }


  
  

  addFloor(surface: number) {
    return this.http.post(this.baseurl + '/etage/', { surface },{headers: this.httpHeaders});
  }
  getAllZones() : Observable<any>{
    return this.http.get(this.baseurl + '/zones/',
     {headers: this.httpHeaders});
  }
  addEquipement(equipement:{  nom: string, marque: string, etat: string, categorie: string, type: string, puissance: number, maxConsommation: number, minConsommation: number, zoneE: number }) : Observable<any>{
    const body = {  nom: equipement.nom, marque: equipement.marque, etat: equipement.etat, categorie: equipement.categorie, type: equipement.type, puissance: equipement.puissance, maxConsommation: equipement.maxConsommation, minConsommation: equipement.minConsommation, zoneE: equipement.zoneE}
    return this.http.post(this.baseurl + '/equipement/', body,{headers: this.httpHeaders});
  }


}

  

