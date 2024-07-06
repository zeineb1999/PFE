import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable , Subject, interval,of } from 'rxjs';
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
  type: string;
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
  lancementSocket = new Subject<any>();
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
  ajouterZoneArchi(nomLocal: string, etageZ: number,maxT: number, minT: number,maxH: number, minH: number): Observable<any> {
    const etageData = {
      nomLocal:nomLocal,
      maxT:maxT,
      minT:minT,
      maxH:maxH,
      minH:minH,
      etageZ:etageZ
    };
    //console.log("zone ajoutéeeeeeeeee ",etageData)
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
  getAllRapports(): Observable<any> {
    return this.http.get(`${this.baseurl}/rapport/`, { headers: this.httpHeaders })
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
        //console.log(result)
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

  addFloor(etage:{ nomEtage: string, batimentId: number }) : Observable<any>{
    const body = {  nomEtage: etage.nomEtage,batimentId: etage.batimentId}
    return this.http.post(this.baseurl + '/etage/', body,{headers: this.httpHeaders});
  }
  addBatiment(batiment:{ nomBatiment: string, typeBatiment: string }) : Observable<any>{
    const body = {  nomBatiment: batiment.nomBatiment,typeBatiment: batiment.typeBatiment}
    return this.http.post(this.baseurl + '/batiment/', body,{headers: this.httpHeaders});
  }
  getAllZones() : Observable<any>{
    return this.http.get(this.baseurl + '/zones/',
     {headers: this.httpHeaders});
  }
  getRapportsByAlerteId(alerteId: number): Observable<any> {
    return this.http.get<any>(this.baseurl + '/rapportByAlerte/'+ alerteId ,
      {headers: this.httpHeaders});
  }
 
  addEquipement(equipement:{  nom: string, type:string,minC:number,maxC:number, etat: string, categorie: string, puissance: number, zoneE: number }) : Observable<any>{
    const body = {  nom: equipement.nom,type:equipement.type,minC:equipement.minC,maxC:equipement.maxC ,  etat: equipement.etat, categorie: equipement.categorie, puissance: equipement.puissance, zoneE: equipement.zoneE}
    //console.log("body: ",body)
    return this.http.post(this.baseurl + '/equipement/', body,{headers: this.httpHeaders});
  }
  addEquipementAjouter(equipement:{  nom: string,  etat: string, categorie: string, puissance: number, zoneE: number,rapport:number }) : Observable<any>{
    const body = {  nom: equipement.nom,  etat: equipement.etat, categorie: equipement.categorie, puissance: equipement.puissance, zoneE: equipement.zoneE,rapport:equipement.rapport}
    //console.log("body: ",body)
    return this.http.post(this.baseurl + '/equipementajouter/', body,{headers: this.httpHeaders});
  }
  createEquipementArchive(nom: string,categorie: string, puissance: number, zoneE: number):Observable<any>{
    const body = {  nom: nom,  categorie: categorie, puissance: puissance, zoneE: zoneE}
    //console.log("body: ",body)
    return this.http.post(this.baseurl + '/equipementarchive/', body,{headers: this.httpHeaders});

  }
  getInitialData() : Observable<any>{
    return this.http.get(this.baseurl + '/initialData/',
     {headers: this.httpHeaders});
  }
  addZone(zone:{ id: number, nomLocal: string, typeLocal: string,surface: number,	minT: number, maxT: number, minH: number, maxH: number, etageZ: number }) : Observable<any>{
    const body = {  nomLocal: zone.nomLocal,typeLocal: zone.typeLocal,surface: zone.surface,minT: zone.minT, maxT: zone.maxT, minH: zone.minH, maxH: zone.maxH,etageZ: zone.etageZ}
    return this.http.post(this.baseurl + '/zones/', body,{headers: this.httpHeaders});
  }

  getOneZone(id: number) : Observable<any>{
    return this.http.get(this.baseurl + '/zones/'+ id+'/' ,
    {headers: this.httpHeaders});
  }

  getAlerte(id: number) : Observable<any>{
    return this.http.get(this.baseurl + '/alerte/'+ id+'/' ,
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
getEquipementAjouterDetails(equipementId: number): Observable<any> {
  return this.http.get(this.baseurl + '/equipementRemplacement/'+ equipementId+'/' ,
  {headers: this.httpHeaders});
}

getZonesForEtage(etageId: number): Observable<any> {
  return this.http.get<any>(this.baseurl + '/etage/'+ etageId+'/zones/' ,
    {headers: this.httpHeaders});
}
getRapportsByEquipementId(equipementId: number): Observable<any> {
  return this.http.get<any>(this.baseurl + '/rapportByEquipement/'+ equipementId ,
    {headers: this.httpHeaders});
}
getAlertesByEquipementId(equipementId: number): Observable<any> {
  return this.http.get<any>(this.baseurl + '/alertesByEquipement/'+ equipementId ,
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
getAllAlertes() : Observable<any>{
  return this.http.get(this.baseurl + '/alerte/',
   {headers: this.httpHeaders});
}

deleteEquipement(equipementId: number): Observable<any> {
  return this.http.delete(`${this.baseurl}/equipement/${equipementId}`, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError)
    );
}
deleteEquipementAjouter(equipementId: number): Observable<any> {
  return this.http.delete(`${this.baseurl}/equipementajouter/${equipementId}`, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError)
    );
}
deleteBatiment(equipementId: number): Observable<any> {
  return this.http.delete(`${this.baseurl}/batiment/${equipementId}`, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError)
    );
}
deleteZone(zoneId: number): Observable<any> {
  return this.http.delete(`${this.baseurl}/zones/${zoneId}/`, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError)
    );
}
deleteEtage(etageId: number): Observable<any> {
  return this.http.delete(`${this.baseurl}/etage/${etageId}/`, { headers: this.httpHeaders })
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
modifierValeurs1(zoneId: number, val1:number) : Observable<any> {
    const body = {  zoneId:zoneId,val1:val1 }
    //console.log("body: ",body)
    return this.http.post(this.baseurl + '/modifierParam1/', body,{headers: this.httpHeaders});

  
}
modifierValeurs2(zoneId: number, val2:number) : Observable<any> {
  const body = {  zoneId:zoneId,val2:val2 }
    //console.log("body: ",body)
    return this.http.post(this.baseurl + '/modifierParam2/', body,{headers: this.httpHeaders});

}
modifierValeurs3(zoneId: number, val3:number) : Observable<any> {
  const body = {  zoneId:zoneId,val3:val3 }
    //console.log("body: ",body)
    return this.http.post(this.baseurl + '/modifierParam3/', body,{headers: this.httpHeaders});

}
modifierValeurs4(zoneId: number, val4:number) : Observable<any> {
  const body = {  zoneId:zoneId,val4:val4 }
    //console.log("body: ",body)
    return this.http.post(this.baseurl + '/modifierParam4/', body,{headers: this.httpHeaders});

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

  getHopitalConsommationParMois(): Observable<any> {
    const url = 'http://127.0.0.1:8000/api/hopital_consommation_par_mois';
    return this.http.get<any>(url);
  }

  // Chercher la consommation par période:
  // par equipement:
  getAnEquipementConsommation(equipementId: number, dateDebut: string, dateFin: string): Observable<any> {
    const url =  `${this.baseurl}/equipement-consommation-p/${equipementId}/?dateDebut=${dateDebut}&dateFin=${dateFin} `;
    return this.http.get<any>(url);
  }

  getConsommationEquipementParPeriode(dateDebut: string, dateFin: string): Observable<any> {
    const url =  `${this.baseurl}/equipement-consommation-p/?dateDebut=${dateDebut}&dateFin=${dateFin} `;
    return this.http.get<any>(url);
  }
  // par local:
  getConsommationLocalParPeriode(dateDebut: string, dateFin: string): Observable<any> {
    const url = ` ${this.baseurl}/zone-consommation-p/?dateDebut=${dateDebut}&dateFin=${dateFin} `;
    return this.http.get<any>(url);
  }
  // par etage:
  getConsommationEtageParPeriode(batimentId: number, dateDebut: string, dateFin: string): Observable<any> {
    const url = ` ${this.baseurl}/etage-consommation-p/${batimentId}/?dateDebut=${dateDebut}&dateFin=${dateFin} `;
    return this.http.get<any>(url);
  }
  // par batiment:
  getConsommationBatimentParPeriode(dateDebut: string, dateFin: string): Observable<any> {
    const url = ` ${this.baseurl}/batiment-consommation-p?dateDebut=${dateDebut}&dateFin=${dateFin} `;
    return this.http.get<any>(url);
  }

  getHopitalConsommationPendantMois(dateDebut: string, dateFin: string): Observable<any> {
    const url = ` ${this.baseurl}/hopital_consommation_pendant_mois?dateDebut=${dateDebut}&dateFin=${dateFin} `;
    return this.http.get<any>(url);
  }
  getHopitalConsommationPendantMoisNormal(dateDebut: string, dateFin: string): Observable<any> {
    const url = ` ${this.baseurl}/hopital_consommation_pendant_mois_critique?dateDebut=${dateDebut}&dateFin=${dateFin} `;
    return this.http.get<any>(url);
  }
  getHopitalConsommationPendantMoisCritique(dateDebut: string, dateFin: string): Observable<any> {
    const url = ` ${this.baseurl}/hopital_consommation_pendant_mois_normal?dateDebut=${dateDebut}&dateFin=${dateFin} `;
    return this.http.get<any>(url);
  }
  getHopitalConsommationPendantMoisCritiqueETNormal(): Observable<any> {
    const url = ` ${this.baseurl}/hopital_consommation_pendant_mois_all`;
    return this.http.get<any>(url);
  }
  getHopitalConsommationCriticite(mois:any): Observable<any> {
    const url = ` ${this.baseurl}/hopital_consommation_total`;
    
    const options = {
      params: {
        mois:mois // Convertissez nom_fichier en chaîne et ajoutez-le à vos paramètres (to string())
      }
    };
    return this.http.get<any>(url, options);
  }

  sendCode(email:string,code: number): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/modificationProfile/', { email ,code});
  }

  genererDATA(id:number, minT:number,maxT:number,minH:number,maxH:number): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/genererDATA/', { id ,minT,maxT,minH,maxH});

  }
  rechercher_donnees(date: string, nom_fichier: number): Observable<any> {
    const options = {
      params: {
        date: date, // Ajoutez date_heure à vos paramètres
        nom_fichier: nom_fichier.toString() // Convertissez nom_fichier en chaîne et ajoutez-le à vos paramètres (to string())
      }
    };
    return this.http.get<any>('http://127.0.0.1:8000/api/rechercher_donnees/', options);
  }

  getBatimentsList() {
    //return this.http.get<any>(`http://127.0.0.1:8000/api/batimentsList/?date=${date}`);
    return this.http.get<any>('http://127.0.0.1:8000/api/batimentsList/');
  }

  recupererDonnees( nom_fichier: number,date: string): Observable<any> {
    const options = {
      params: {
        date: date, // Ajoutez date_heure à vos paramètres
        nom_fichier: nom_fichier.toString() // Convertissez nom_fichier en chaîne et ajoutez-le à vos paramètres (to string())
      }
    };
    return this.http.get<any>('http://127.0.0.1:8000/api/recuperer/', options);
  }

  avg_TH_par_heure( nom_fichier: number,date: string): Observable<any> {
    const options = {
      params: {
        date: date, // Ajoutez date_heure à vos paramètres
        nom_fichier: nom_fichier.toString() // Convertissez nom_fichier en chaîne et ajoutez-le à vos paramètres (to string())
      }
    };
    return this.http.get<any>('http://127.0.0.1:8000/api/avg_TH_par_heure/', options);
  }
  avg_TH_par_jour( nom_fichier: number,date: string): Observable<any> {
    const options = {
      params: {
        date: date, // Ajoutez date_heure à vos paramètres
        nom_fichier: nom_fichier.toString() // Convertissez nom_fichier en chaîne et ajoutez-le à vos paramètres (to string())
      }
    };
    return this.http.get<any>('http://127.0.0.1:8000/api/avg_TH_par_jour/', options);
  }
  avg_TH_par_instant( nom_fichier: number,date: string): Observable<any> {
    const options = {
      params: {
        date: date, // Ajoutez date_heure à vos paramètres
        nom_fichier: nom_fichier.toString() // Convertissez nom_fichier en chaîne et ajoutez-le à vos paramètres (to string())
      }
    };
    return this.http.get<any>('http://127.0.0.1:8000/api/avg_TH_par_instant/', options);
  }
  addAlerte( localId:number,type:string , dateAlerte: Date, text: string, valeur: number) : Observable<any>{
    const body = {  localId: localId,type: type, dateAlerte: dateAlerte, text: text, valeur: valeur}
    ////console.log(body)
    return this.http.post(this.baseurl + '/alerte/', body,{headers: this.httpHeaders});
  }
  getAlertesById(id: number) : Observable<any>{
    const url = ` ${this.baseurl}/alerteById?id=${id} `;
    return this.http.get<any>(url);
  }
  getAlertesSansId(): Observable<any>{
    const url = 'http://127.0.0.1:8000/api/alerteSansId ';
    return this.http.get<any>(url);
  }
  addUserAlerte(idAlerte:number,idUser:number) : Observable<any>{

    return this.http.post('http://127.0.0.1:8001/api/addUserAlerte', {idAlerte, idUser});

  }

  setAlerteNotifie(alerteId: number, alerteData:any): Observable<any> {
    const url = `${this.baseurl}/alerte/${alerteId}/`;
    return this.http.put(url, alerteData, { headers: this.httpHeaders })
      .pipe(
        catchError(this.handleError)
      );
    }
    setAlerteNotifieZeineb(alerteId: number,): Observable<any> {

      return this.http.post('http://127.0.0.1:8000/api/notifierAlerte', {alerteId });

    }
    set(alerteId: number): Observable<any> {
      const t="khra";
      // Retourne un Observable contenant la valeur "khra"
      return of (t);
    }
    get_alerte_non_notifie(userID: number) {

      const url = ` ${this.baseurl}/get_alerte_non_notifie?userID=${userID} `;
      return this.http.get<any>(url);
    }
    addRapport( alerte: number, redacteur:number , causes: string, solutions: string, risques: string, equipementsDemandes: string, equipementsNecessites: string,equipement: number, date: Date) : Observable<any>{
      const rapport = {
          alerte: alerte,
          redacteur:redacteur ,
          causes: causes,
          solutions: solutions,
          risques: risques,
          equipementsDemandes: equipementsDemandes,
          equipementsNecessites: equipementsNecessites,
          equipement: equipement,
          vu: false,
          notifie : false,
          dateRapport: date

      }
      //console.log(rapport)
      return this.http.post(this.baseurl + '/rapport/', rapport,{headers: this.httpHeaders});
    }

    addRapportEquipementEndommage(rapport: number, equipement: number) {
      const data = {rapport: rapport, equipement: equipement}
      return this.http.post(this.baseurl + '/RapportEquipementEndommage/', rapport,{headers: this.httpHeaders});
    }
    stopDjangoMethod(): Observable<any> {
      return this.http.get<any>('http://127.0.0.1:8000/api/stop-method/ ', {});
    }
    startDjangoMethod(): Observable<any> {
      return this.http.get<any>('http://127.0.0.1:8000/api/start-method/ ', {});
    }
    getSauvegardeData(): Observable<any> {
      return this.http.get<any>('http://127.0.0.1:8000/api/sauvegarde/ ');

  }

  addDecision(id: number,decision: string): Observable<any> {
    const data = {id: id,decision: decision }
    return this.http.post(this.baseurl + '/decision/', data);
  }
  addCout(id: number,cout: number): Observable<any> {
    const data = {id: id,cout: cout }
    return this.http.post(this.baseurl + '/cout/', data);
  }
  addApprovation(id: number,approuve:string): Observable<any> {
    const data = {id: id ,approuve:approuve}
    return this.http.post(this.baseurl + '/approvation/', data);
  }
  archiveEquipement(id:number) : Observable<any> {
    const data = {id: id }
    return this.http.post(this.baseurl + '/archive/', data);
  }

    createHistorique(rapport: any,decision: string,equipement:any,equipementDest:any): Observable<any> {
      /* const maDate = new Date();
      const annee = maDate.getUTCFullYear();
      const mois = String(maDate.getUTCMonth() + 1).padStart(2, '0');
      const jour = String(maDate.getUTCDate()).padStart(2, '0');
      const heures = String(maDate.getUTCHours()+1).padStart(2, '0');
      const minutes = String(maDate.getUTCMinutes()).padStart(2, '0');
      const secondes = String(maDate.getUTCSeconds()).padStart(2, '0');
      const millisecondes = String(maDate.getUTCMilliseconds()).padStart(3, '0');
      const date = ${annee}-${mois}-${jour}T${heures}:${minutes}:${secondes}.${millisecondes}; */
      const data = {
        rapport: rapport.id,
        decision: decision,
        equipement:equipement.id
      };
      //console.log(data)
      return this.http.post(this.baseurl + '/historique/', data,{headers: this.httpHeaders});
    }
    createHistoriqueRemplacement(rapport: any,decision: string,equipement:any,equipementDest:any): Observable<any> {
      /* const maDate = new Date();
      const annee = maDate.getUTCFullYear();
      const mois = String(maDate.getUTCMonth() + 1).padStart(2, '0');
      const jour = String(maDate.getUTCDate()).padStart(2, '0');
      const heures = String(maDate.getUTCHours()+1).padStart(2, '0');
      const minutes = String(maDate.getUTCMinutes()).padStart(2, '0');
      const secondes = String(maDate.getUTCSeconds()).padStart(2, '0');
      const millisecondes = String(maDate.getUTCMilliseconds()).padStart(3, '0');
      const date = ${annee}-${mois}-${jour}T${heures}:${minutes}:${secondes}.${millisecondes}; */
      const data = {
        rapport: rapport,
        decision: decision,
        equipement:equipement,
        equipementDest:equipementDest
      };
      //console.log(data)
      return this.http.post(this.baseurl + '/historique/', data,{headers: this.httpHeaders});
    }
    getPeriodeParEquipement(equipement_id: number, date: string): Observable<any> {
      const url =  `${this.baseurl}/equipement/${equipement_id}/periodes?date=${date}`;
      return this.http.get<any>(url);
    }
    generatePeriode(equipement_id: number): Observable<any> {
      return this.http.post<any>('http://127.0.0.1:8000/api/genererPeriode/', { equipement_id});
  
    }
    setHistorique(id:number,firstname:string,change:string,action:string):  Observable<any> {
      const data = {
        numero: id,
        firstname: firstname,
        change: change,
        action: action
      }
      return this.http.post(this.baseurl + '/historiqueUser/',data,{headers: this.httpHeaders});
    }
    getAllHistoriqueUsers(): Observable<any> {
      return this.http.get<any>(this.baseurl + '/historiqueUser/');
    }
    ActiverBatiment(batimentId :number,date:string):Observable<any>{
      const data = {
        batimentId,
        date

      }
      return this.http.post(this.baseurl + '/activerBatiment/',data,{headers: this.httpHeaders});

    }
    DesactiverBatiment(batimentId :number,date:string):Observable<any>{
      const data = {
        batimentId,
        date
      }
      return this.http.post(this.baseurl + '/desactiverBatiment/',data,{headers: this.httpHeaders});

    }
    ActiverEtage(batimentId :number,date:string):Observable<any>{
      const data = {
        batimentId,
        date

      }
      return this.http.post(this.baseurl + '/activerEtage/',data,{headers: this.httpHeaders});

    }
    DesactiverEtage(batimentId :number,date:string):Observable<any>{
      const data = {
        batimentId,
        date
      }
      return this.http.post(this.baseurl + '/desactiverEtage/',data,{headers: this.httpHeaders});

    }
    ActiverZone(batimentId :number,date:string):Observable<any>{
      const data = {
        batimentId,
        date

      }
      return this.http.post(this.baseurl + '/activerZone/',data,{headers: this.httpHeaders});

    }
    DesactiverZone(batimentId :number,date:string):Observable<any>{
      const data = {
        batimentId,
        date
      }
      return this.http.post(this.baseurl + '/desactiverZone/',data,{headers: this.httpHeaders});

    }
    HistoriqueBatiment(option:string,batimentId:number,dateFormatee:string,userId:number,raison:string):Observable<any>{
      const data = {
        option:option,
        batimentId:batimentId,
        date:dateFormatee,
        userId:userId,
        raison:raison
      }
      return this.http.post(this.baseurl + '/historiqueBatiment/',data,{headers: this.httpHeaders});

    }
    HistoriqueEtage(option:string,batimentId:number,dateFormatee:string,userId:number,raison:string):Observable<any>{
      const data = {
        option:option,
        etageId:batimentId,
        date:dateFormatee,
        userId:userId,
        raison:raison
      }
      return this.http.post(this.baseurl + '/historiqueEtage/',data,{headers: this.httpHeaders});

    }
    HistoriqueZone(option:string,batimentId:number,dateFormatee:string,userId:number,raison:string):Observable<any>{
      const data = {
        option:option,
        zoneId:batimentId,
        date:dateFormatee,
        userId:userId,
        raison:raison
      }
      return this.http.post(this.baseurl + '/historiqueZone/',data,{headers: this.httpHeaders});

    }
    allHistoriqueBatiment() : Observable<any>{
      return this.http.get(this.baseurl + '/historiqueBatiment/',
       {headers: this.httpHeaders});
    }
    allHistoriqueEtage() : Observable<any>{
      return this.http.get(this.baseurl + '/historiqueEtage/',
       {headers: this.httpHeaders});
    }
    allHistoriqueZone() : Observable<any>{
      return this.http.get(this.baseurl + '/historiqueZone/',
       {headers: this.httpHeaders});
    }
    allHistoriqueEquipement() : Observable<any>{
      return this.http.get(this.baseurl + '/equipementarchive/',
       {headers: this.httpHeaders});
    }
    ChangerRole(userId:number,role:string):Observable<any>{
      const data = {
        userId,
        role
      }
      return this.http.post(this.baseurl + '/changerRole/',data,{headers: this.httpHeaders});

    }
    deletePeriode(equipementid:number):Observable<any>{
      const data = {
        equipementid
        
      }
      return this.http.post(this.baseurl + '/deletePeriode/',data,{headers: this.httpHeaders});

    }
    dateDesactivation(zoneId: number): Observable<any> {
      return this.http.get(`${this.baseurl}/dateDesactivation/${zoneId}`);
    }
    predictConsumption(data: any): Observable<any> {
      return this.http.post(this.baseurl + '/predict/',data,{headers: this.httpHeaders});

     
    }
    predictConsumptionMois(data:any):Observable<any>{
      return this.http.post(this.baseurl + '/prediction_mois/',data,{headers: this.httpHeaders});
    }
   
    predictConsumptionLocal(data: any): Observable<any> {
      //console.log("hayaaaaaaaaaaaaaaaaaaaaaa ",data)
      return this.http.post(this.baseurl + '/prediction_mois_local/', data, { headers: this.httpHeaders });
    }
    
    predictConsumptionEquipement(data:any):Observable<any>{
      return this.http.post(this.baseurl + '/prediction_mois_equipement/',data,{headers: this.httpHeaders});
    }


    
  }