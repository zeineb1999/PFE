import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import * as Highcharts from 'highcharts';
import { FloorService } from '../../service/floor.service';

import { Router } from '@angular/router';

interface Local {
  id: number;
  nom: string;
  type: string;
  maxT: number;
  minT: number;
  maxH: number;
  minH: number;
  numEtage: number;
  nomEtage: string;
  idBatiment: number;
  nomBatiment: string;
}

interface AlertData {
  localId: number;
  nomLocal: string;
  type: string;
  nowSlash: string;
  alerteId: number;
  userID: number;
  notifie: any;
  vu: any;
}

@Component({
  selector: 'app-locals-list',
  templateUrl: './locals-list.component.html',
  styleUrls: ['./locals-list.component.css']
})



export class LocalsListComponent {
  Highcharts= Highcharts;
  isLoggedIn: boolean;
  temperature: any;
  humidite: any;
  batiments: any;
  alerte: any;
  batimentsLoading: Boolean= true;
  localsT: number[] = []
  localsH: number[] = []

  @Output() alerteChange = new EventEmitter<AlertData>();

  emitAlert(localId: number, nomLocal: string, type: string, nowSlash: any, alerteId: number, userID: number) {
    let notifie = false;
    let vu = false;
    let data : AlertData = {localId, nomLocal, type, nowSlash, alerteId, userID, notifie, vu}
    this.alerteChange.emit(data);
  }

  constructor(private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnInit(): void {

    this.batimentsLoading  =true;
    const parentElement = this.el.nativeElement.querySelector('#container');

    let dateISO = new Date().toISOString();
    let nowSlash = new Date();


    this.floorService.getBatimentsList().subscribe(
      (batiments: any) => {
        this.batiments = batiments;
        this.localsT=[]
        this.localsH=[]
        batiments.forEach((batiment: any) => {
          batiment.etages.forEach((etage: any) => {
            etage.zones.forEach((local: any) => {
              this.floorService.avg_TH_par_heure(local.id,this.dateFormatter(dateISO)).subscribe(
                (response: any) => {
                  nowSlash = new Date();
                  this.localsT[local.id-1] = (response.T.toFixed(1))
                  this.localsH[local.id-1] = (response.H.toFixed(1))
                  if (dateISO.substring(14, 16) == '00') {
                    console.log('rahi 00 neb3at les alertes')
                    this.verifierSiAlerte(local, response, nowSlash)
                  } else {
                    console.log('maneb3atch les alertes')
                  }
                  },
                  (error) => {
                    console.error('Erreur lors de la récupération des données : ', error);
                  }
                );

              setInterval(() => {
                dateISO = new Date().toISOString();
                if(dateISO.substring(14, 16)=='00') {
                  console.log('rani n3aweeeeeeeeeed')

                  etage.zones.forEach((local: any) => {
                    this.floorService.avg_TH_par_heure(local.id,this.dateFormatter(dateISO)).subscribe(
                      (response: any) => {
                        this.localsT[local.id-1] = (response.T.toFixed(1))
                        this.localsH[local.id-1] = (response.H.toFixed(1))
                        this.verifierSiAlerte(local, response, nowSlash)
                      },
                      (error) => {
                        console.error('Erreur lors de la récupération des données : ', error);
                      }
                    );
                  })
                  setInterval(() => {
                    dateISO = new Date().toISOString();
                    console.log('rani n3aweeeeeeeeeed')

                    etage.zones.forEach((local: any) => {
                      this.floorService.avg_TH_par_heure(local.id,this.dateFormatter(dateISO)).subscribe(
                        (response: any) => {
                          this.verifierSiAlerte(local, response, nowSlash)
                        },
                        (error) => {
                          console.error('Erreur lors de la récupération des données : ', error);
                        }
                      );

                    })

                  }, 1000 * 60 * 60);
                }
              }, 60000)

            });

          });
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des batiments : ', error);
      }
    );


  }

  verifierSiAlerte(local: any, response: any, nowSlash: any) {

    let text = ''
    if (response.T > local.maxT || response.T < local.minT) {
      this.floorService.getZoneDetails(local.id).subscribe((thisLocal: any) => {
        text = thisLocal.nomLocal+ 'enregistre une température moyenne inhabituelle';
      })
      //let text =
      this.floorService.addAlerte( local.id,'temperature',nowSlash, text, response.T).subscribe(
        (alerte: any) => {
          this.emitAlert(local.id, local.nomLocal, 'maintenance', nowSlash, alerte.id, 0);
        })
    }

    if(response.H > local.maxH || response.H < local.minH){
      this.floorService.getZoneDetails(local.id).subscribe((thisLocal: any) => {
        text = thisLocal.nomLocal+ 'enregistre une humidité moyenne inhabituelle';
      })

      this.floorService.addAlerte( local.id,'humidite',nowSlash, text, response.H).subscribe(
        (alerte: any) => {
          this.emitAlert(local.id, local.nomLocal, 'humidite', nowSlash, alerte.id, 0);
        }
      )
    }
  }


  getTH(zones: any[], now: string, localId: number){
    zones.forEach((local: any) => {
      this.floorService.rechercher_donnees(now, localId).subscribe(
        (response: any) => {
          local.T = response.data[0][0]
          local.H = response.data[0][1]
        },
        (error) => {
          console.error('Erreur lors de la récupération des données : ', error);
        }
      );
    });
  }

  insertTHColumns(elementId: string, data_T: any[], data_H: any[]){
    Highcharts.chart(elementId, {
      data: {
        table: 'datatable'
      },
      chart: {
          type: 'column'
      },
      title: {
          text: 'Live births in Norway'
      },
      subtitle: {
        text:
        'Source: <a href="https://www.ssb.no/en/statbank/table/04231" target="_blank">SSB</a>'
      },
      xAxis: {
          type: 'category'
      },
      yAxis: {
          allowDecimals: false,
          title: {
              text: 'Amount'
          }
      },
      series: [{
        type: 'column', // Specify the type of series as 'pie'
        name: 'Température',
        color: 'blue',
        data: data_T
      },
      {
        type: 'column', // Specify the type of series as 'pie'
        name: 'Humidité',
        color: 'green',
        data: data_H
      }]
    });
  }

  getT(idLocal: number){
    let dateISO = new Date().toISOString();

    // Extraire les composants de la date
    let year = dateISO.substring(0, 4);
    let month = dateISO.substring(5, 7);
    let day = dateISO.substring(8, 10);
    let hours = dateISO.substring(11, 13);
    let minutes = dateISO.substring(14, 16);

    // Formater la date selon le format requis
    let date = day + '/' + month + '/' + year + ' ' + (parseInt(hours)-1) + ':' + '00' + ':00';

    this.floorService.rechercher_donnees(date, idLocal).subscribe(
      (response: any) => {
        return response.data[0][0]

      },
      (error) => {
        console.error('Erreur lors de la récupération des données : ', error);
      }
    );
    return 0
  }

  getH(idLocal: number){
    let dateISO = new Date().toISOString();

    // Extraire les composants de la date
    let year = dateISO.substring(0, 4);
    let month = dateISO.substring(5, 7);
    let day = dateISO.substring(8, 10);
    let hours = dateISO.substring(11, 13);
    let minutes = dateISO.substring(14, 16);

    // Formater la date selon le format requis
    let date = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':00';

    this.floorService.rechercher_donnees(date, idLocal).subscribe(
      (response: any) => {
        return response.data[0][1]
      },
      (error) => {
        console.error('Erreur lors de la récupération des données : ', error);
      }
    );
    return 0
  }

  dateFormatter(dateISO: any){
    // Formater la date selon le format requis
    return dateISO.substring(0, 4) + '-' +
    dateISO.substring(5, 7) + '-' +
    dateISO.substring(8, 10)  + ' ' +
    dateISO.substring(11, 13) + ':' +
    dateISO.substring(14, 16) + ':00';
  }

}





/*
import { Component, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import * as Highcharts from 'highcharts';
import { FloorService } from '../../service/floor.service';

import { Router } from '@angular/router';

interface Local {
  id: number;
  nom: string;
  type: string;
  maxT: number;
  minT: number;
  maxH: number;
  minH: number;
  numEtage: number;
  nomEtage: string;
  idBatiment: number;
  nomBatiment: string;
}

@Component({
  selector: 'app-locals-list',
  templateUrl: './locals-list.component.html',
  styleUrls: ['./locals-list.component.css']
})



export class LocalsListComponent {
  Highcharts= Highcharts;
  isLoggedIn: boolean;
  temperature: any;
  humidite: any;
  batiments: any;
  batimentsLoading: Boolean= true;

  constructor(private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnInit(): void {


    this.batimentsLoading  =true;
    const parentElement = this.el.nativeElement.querySelector('#container');

    let dateISO = new Date().toISOString();

    // Extraire les composants de la date
    let year = dateISO.substring(0, 4);
    let month = dateISO.substring(5, 7);
    let day = dateISO.substring(8, 10);
    let hours = dateISO.substring(11, 13);
    let minutes = dateISO.substring(14, 16);

    // Formater la date selon le format requis
    let now = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':00';

    this.floorService.getBatimentsList().subscribe(
      (batiments: any) => {
        console.log(batiments)
        this.batiments = batiments;
        batiments.forEach((batiment: any) => {
          let batimentElement = this.renderer.createElement('div')
          this.renderer.setAttribute(batimentElement, 'id', 'batiment'+'-'+batiment.id);
          this.renderer.appendChild(parentElement, batimentElement);

          batiment.etages.forEach((etage: any) => {
            let etageElement = this.renderer.createElement('div')
            this.renderer.setAttribute(etageElement, 'id', 'etage'+'-'+etage.id);
            this.renderer.setAttribute(etageElement, 'style', 'width: 50%; height: 300px');
            this.renderer.appendChild(batimentElement, etageElement);

            let nblocaux = etage.zones.length;
            console.log('etage ',etage.id,' zones:', etage.zones)
            let data_T : number[] = []
            let data_H : number[] = []
            etage.zones.forEach((local: any) => {
              this.floorService.rechercher_donnees(now, local.id).subscribe(
                (response: any) => {
                  data_T.push(response.data[0][0])
                  data_H.push(response.data[0][1])

                  console.log('data_T.length: ', data_T.length, 'data_H.length ', 'nb: ',nblocaux,'-> ', data_T.length==nblocaux && data_H.length==nblocaux)
                  if(data_T.length==nblocaux && data_H.length==nblocaux){
                    console.log('zone ',local.id,' data_T: ',data_T, ' data_H', data_H, 'len: ', nblocaux)
                    this.insertTHColumns('etage'+'-'+etage.id, data_T, data_H)
                  }
                },
                (error) => {
                  console.error('Erreur lors de la récupération des données : ', error);
                }
              );
            });
          });
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des batiments : ', error);
      }
    );


  }

  insertTHColumns(elementId: string, data_T: any[], data_H: any[]){
    console.log('T: ', data_T)
    console.log('H: ', data_H)

    Highcharts.chart(elementId, {
      data: {
        table: 'datatable'
      },
      chart: {
          type: 'column'
      },
      title: {
          text: 'Live births in Norway'
      },
      subtitle: {
        text:
        'Source: <a href="https://www.ssb.no/en/statbank/table/04231" target="_blank">SSB</a>'
      },
      xAxis: {
          type: 'category'
      },
      yAxis: {
          allowDecimals: false,
          title: {
              text: 'Amount'
          }
      },
      series: [{
        type: 'column', // Specify the type of series as 'pie'
        name: 'Température',
        color: 'blue',
        data: data_T
      },
      {
        type: 'column', // Specify the type of series as 'pie'
        name: 'Humidité',
        color: 'green',
        data: data_H
      }]
    });
  }

  getT(idLocal: number){
    let dateISO = new Date().toISOString();

    // Extraire les composants de la date
    let year = dateISO.substring(0, 4);
    let month = dateISO.substring(5, 7);
    let day = dateISO.substring(8, 10);
    let hours = dateISO.substring(11, 13);
    let minutes = dateISO.substring(14, 16);

    // Formater la date selon le format requis
    let date = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':00';

    this.floorService.rechercher_donnees(date, idLocal).subscribe(
      (response: any) => {
        return response.data[0][0]

      },
      (error) => {
        console.error('Erreur lors de la récupération des données : ', error);
      }
    );
    return 0
  }

  getH(idLocal: number){
    let dateISO = new Date().toISOString();

    // Extraire les composants de la date
    let year = dateISO.substring(0, 4);
    let month = dateISO.substring(5, 7);
    let day = dateISO.substring(8, 10);
    let hours = dateISO.substring(11, 13);
    let minutes = dateISO.substring(14, 16);

    // Formater la date selon le format requis
    let date = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':00';

    this.floorService.rechercher_donnees(date, idLocal).subscribe(
      (response: any) => {
        return response.data[0][1]
      },
      (error) => {
        console.error('Erreur lors de la récupération des données : ', error);
      }
    );
    return 0
  }

}
 */
