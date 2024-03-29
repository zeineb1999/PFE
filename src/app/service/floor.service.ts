import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable , interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
export interface Equipement {
  id: number;
  nom: string;
  etat: string;
  categorie: string;
  puissance: number;
  maxConsommation: number;
  minConsommation: number;
  zoneE: number;
}
export interface Zone {
  id: number;
  nomLocal: string;
  typeLocal: string;
  surface: number;
  etageZ: number;
}
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
  addEquipement(equipement:{  nom: string,  etat: string, categorie: string, puissance: number, maxConsommation: number, minConsommation: number, zoneE: number }) : Observable<any>{
    const body = {  nom: equipement.nom,  etat: equipement.etat, categorie: equipement.categorie, puissance: equipement.puissance, maxConsommation: equipement.maxConsommation, minConsommation: equipement.minConsommation, zoneE: equipement.zoneE}
    return this.http.post(this.baseurl + '/equipement/', body,{headers: this.httpHeaders});
  }
  addZone(zone:{  nomLocal: string, typeLocal: string,surface: number,	 etageZ: number }) : Observable<any>{
    const body = {  nomLocal: zone.nomLocal,typeLocal: zone.typeLocal,surface: zone.surface,etageZ: zone.etageZ}
    return this.http.post(this.baseurl + '/zones/', body,{headers: this.httpHeaders});
  }
  getOneZone(id: number) : Observable<any>{
    return this.http.get(this.baseurl + '/zones/'+ id+'/' ,
    {headers: this.httpHeaders});
 
  }
  getZoneDetails(zoneId: number): Observable<any> {
    return this.http.get(this.baseurl + '/zones/'+ zoneId+'/' ,
    {headers: this.httpHeaders});

    
}
getEquipementDetails(equipementId: number): Observable<any> {
  return this.http.get(this.baseurl + '/equipement/'+ equipementId+'/' ,
  {headers: this.httpHeaders});
}
getZonesForEtage(etageId: number): Observable<any> {
  return this.http.get<any>(this.baseurl + '/etage/'+ etageId+'/zones/' ,
    {headers: this.httpHeaders});
}
getEquipementsByZone(zoneId: number): Observable<any> {
  return this.http.get<any>(this.baseurl + '/zones/'+ zoneId+'/equipements/' ,
    {headers: this.httpHeaders});
}


getAllEquipements() : Observable<any>{
  return this.http.get(this.baseurl + '/equipement/',
   {headers: this.httpHeaders});
}

deleteEquipement(equipementId: number): Observable<any> {
  return this.http.delete(`${this.baseurl}/equipement/${equipementId}`, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError)
    );
}
deleteZone(zoneId: number): Observable<any> {
  return this.http.delete(`${this.baseurl}/zones/${zoneId}`, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError)
    );
}
deleteEtage(etageId: number): Observable<any> {
  return this.http.delete(`${this.baseurl}/etage/${etageId}`, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError)
    );
}
modifierEquipement(equipementId: number, equipementData: Equipement): Observable<any> {
  const url = `${this.baseurl}/equipement/${equipementId}/`;
  return this.http.put(url, equipementData, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError)
    );
}

getEquipementAModifier(equipementId: number): Observable<Equipement> {
  const url = `${this.baseurl}/equipement/${equipementId}/`;
  return this.http.get<Equipement>(url, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError)
    );
}
modifierZone(zoneId: number, zoneData:  Zone) : Observable<any> {
  const url = `${this.baseurl}/zones/${zoneId}/`;
  return this.http.put(url, zoneData, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError)
    );
}

getZoneAModifier(zoneId: number): Observable<Zone> {
  const url = `${this.baseurl}/zones/${zoneId}/`;
  return this.http.get<Zone>(url, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError)
    );
}
// excel.service.ts




getCSVData(file_path: string) {
  return this.http.get<any>('http://localhost:8000/api/read-csv/' + file_path);
}

getNotifications() {
  return ["one","two","three","four","five"];
}

private excelDataUrl = 'http://localhost:8000/api/excel-data/'
getExcelData(): Observable<any> {
  return interval(10000) // Met à jour les données toutes les 10 secondes
    .pipe(
      switchMap(() => this.http.get<any>(this.excelDataUrl))
    );
}
}




