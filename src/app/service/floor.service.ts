import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable , interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import {  forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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
  ajouterEtage(nomEtage: string, batimentId: number): Observable<any> {
    const etageData = {
      nomEtage: nomEtage,
      batimentId: batimentId
    };
    return this.http.post(this.baseurl + '/etage/', etageData);
  }
  ajouterZoneArchi(nomLocal: string, etageZ: number): Observable<any> {
    const etageData = {
      nomLocal:nomLocal,
      etageZ:etageZ
    };
    return this.http.post(this.baseurl + '/zones/', etageData);
  }
  ajouterEquipementArchi(nom: string, zoneE: number): Observable<any> {
    const etageData = {
      nom:nom,
      zoneE:zoneE
    };
    return this.http.post(this.baseurl + '/equipement/', etageData);
  }
  getAllEtages(): Observable<any> {
    return this.http.get(`${this.baseurl}/etage/`, { headers: this.httpHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllBatiments(): Observable<any> {
    return this.http.get(`${this.baseurl}/batiment/`, { headers: this.httpHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllEtagesETZones(): Observable<any[]> {
    let data1$ = this.http.get<any[]>(this.baseurl + '/etage/', { headers: this.httpHeaders });
    let data2$ = this.http.get<any[]>(this.baseurl + '/zones/', { headers: this.httpHeaders });
    let data3$ = this.http.get<any[]>(this.baseurl + '/batiment/', { headers: this.httpHeaders });

    return forkJoin([data3$, data1$, data2$]).pipe(
      map(([batiments, etages, zones]) => {
        let result: any[] = []; // Initialisation de result comme un tableau vide

        // Ajouter le sommet "hospital" pour chaque bâtiment et chaque étage
        batiments.forEach(batiment => {
          result.push(['hospital', batiment.nomBatiment]); // Ajouter le sommet hospital relié au nom du bâtiment
          etages.forEach(etage => {
            if (etage.batimentId === batiment.id) {
              result.push([batiment.nomBatiment, etage.nomEtage]); // Ajouter chaque étage relié à son bâtiment
              zones.forEach(zone => {
                if (zone.etageZ === etage.id) {
                  result.push([etage.nomEtage, zone.nomLocal]); // Ajouter chaque zone reliée à son étage
                }
              });
            }
          });
        });

        return result;
      })
    );
  }

  getAllEtagesETZonesArchi(): Observable<any[]> {
    let data1$ = this.http.get<any[]>(this.baseurl + '/etage/', { headers: this.httpHeaders });
    let data2$ = this.http.get<any[]>(this.baseurl + '/zones/', { headers: this.httpHeaders });
    let data3$ = this.http.get<any[]>(this.baseurl + '/batiment/', { headers: this.httpHeaders });

    return forkJoin([data3$, data1$, data2$]).pipe(
      map(([batiments, etages, zones]) => {
        let result: any[] = []; // Initialisation de result comme un tableau vide
        result.push({ id: '0.0', parent: '', name: 'Hospital' });
        let i = 1; (batiments)

        // Parcourir les bâtiments
        batiments.forEach(batiment => {
          let j = 1; // Réinitialisation de j pour chaque nouveau bâtiment (etages)
          result.push({ id: '1.' + i, parent: '0.0', name: batiment.nomBatiment });
          // Ajouter le sommet hospital relié au nom du bâtiment

          // Parcourir les étages
          etages.forEach(etage => {
            if (etage.batimentId === batiment.id) {
              let k = 1; // Réinitialisation de k pour chaque nouvel étage (zones)
              result.push({ id: '2.' + j, parent: '1.' + i, name: etage.nomEtage }); // Ajouter chaque étage relié à son bâtiment
              // Parcourir les zones
              zones.forEach(zone => {
                if (zone.etageZ === etage.id) {
                  result.push({ id: '3.' + k, parent: '2.' + j, name: zone.nomLocal }); // Ajouter chaque zone reliée à son étage
                  k++;
                }
              });
            }
            j++;
          });
          i++;
        });
        console.log(result)
        return result;
      })
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
  ajouterBatiment(nomBatiment: string,typeBatiment: string): Observable<any> {
    const batimentData = {
      nomBatiment: nomBatiment,
      typeBatiment: typeBatiment
    
    };
    return this.http.post(this.baseurl + '/batiment/', batimentData);
  }
  getBatimentId(nomBatiment: string): Observable<any> {
    return this.http.get<any>(`${this.baseurl}/batiment-id/${nomBatiment}/`);
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
  getOneEtage(nomEtage: string) : Observable<any>{
   
    return this.http.get<any>(`${this.baseurl}/etage-id/${nomEtage}/`);
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

getEtagesByBatiments(batimentId: any): Observable<any> {
  return this.http.get<any>(this.baseurl + '/batiment/'+ batimentId+'/etages/' ,
    {headers: this.httpHeaders});
}

getBatimentById(id: number) : Observable<any>{
  return this.http.get(this.baseurl + '/batiment/'+ id+'/' ,
  {headers: this.httpHeaders});
}

getEtageById(id: number) : Observable<any>{
  return this.http.get(this.baseurl + '/etage/'+ id+'/' ,
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

//equipements cons:

  getTousEquipementsConsommation(): Observable<any> {
    const url = 'http://127.0.0.1:8000/api/equipements/consommation_totale/';
    return this.http.get<any>(url);
  }

  getZonesConsommation(): Observable<any> {
    const url = 'http://127.0.0.1:8000/api/zone_consommation_totale/';
    return this.http.get<any>(url);
  }

  getEtagesConsommation(batimentId: number): Observable<any> {
    const url = `http://127.0.0.1:8000/api/etage_consommation_totale/${batimentId}`;
    return this.http.get<any>(url);
  }

  getBatimentsConsommation(): Observable<any> {
    const url = 'http://127.0.0.1:8000/api/batiment_consommation_totale/';
    return this.http.get<any>(url);
  }
  // Chercher la consommation par période:
  // par equipement:
  getConsommationEquipementParPeriode(dateDebut: string, dateFin: string): Observable<any> {
    const url =  `${this.baseurl}/equipement-consommation-p/?dateDebut=${dateDebut}&dateFin=${dateFin} `;
    return this.http.get<any>(url);
  }
  // par local:
  getConsommationLocalParPeriode(dateDebut: string, dateFin: string): Observable<any> {
    const url = ` ${this.baseurl}/zone-consommation-p/?dateDebut=${dateDebut}&dateFin=${dateFin} `;
    return this.http.get<any>(url);
  }
}


