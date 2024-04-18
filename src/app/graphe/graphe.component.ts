import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_networkgraph from 'highcharts/modules/networkgraph';
import { FloorService } from '../service/floor.service';
import { forkJoin, of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { waitForAsync } from '@angular/core/testing';



interface Local {
  id: number;
  nomLocal: string;
  typeLocal: string;
  etageZ: number;
  surface: any;
}



interface surfaceData {
  name: string;
  y: any;
}

// Définir un type d'étage
interface EtageType {
  infos: any; // id, nom, surface
  locaux: any[];
};
// Définir un type de batiment
interface BatimentType {
  id: number;
  nom: string;
  etages: EtageType[];
};

@Component({
  selector: 'app-graphe',
  templateUrl: './graphe.component.html',
  styleUrls: ['./graphe.component.css']
})
export class GrapheComponent implements OnInit, AfterViewInit {
  Highcharts = Highcharts;
  isLoggedIn: boolean;
  Locals : Local[] = []
  surfaceData: any
  consommationChartOptions: any;
  locaux: any;
  etages: any;
  batiments: any;
  showDatepicker: boolean=false;

  constructor(private floorService: FloorService) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnInit() {
    this.getBatiments();
    this.getEtages();
    this.getLocaux();
    HC_networkgraph(Highcharts);

  }

  ngAfterViewInit() {
    this.BarsChartSurfaces();
    this.initPieChart();
    this.pieChartSurfaces()
    /* this.floorService.getAllEtagesETZones().subscribe((data: any[]) => {
      //console.log('Combined Data:', data);
      this.renderChart(data);
    });
    console.log('ngAfterViewInit called'); */
    this.consommationChart()
    //this.EquipementConsommationChart()
  }

  private buildChartData(data: any[]): any[] {
      const chartData: { from: string, to: string, color: string }[] = [];

      data.forEach((item: any) => {
        const from = item[0];
        for (let i = 1; i < item.length; i++) {
          chartData.push({ from: from, to: item[i], color: '' }); // You might need to set the color property appropriately
        }
      });

      return chartData;
  }

  private renderChart(data: any[]): void {
    Highcharts.chart('container', {
      chart: {
        type: 'networkgraph',
        height: '100%'
      },
      title: {
        text: 'The Indo-European Language Tree',
        align: 'left'
      },
      subtitle: {
        text: 'A Force-Directed Network Graph in Highcharts',
        align: 'left'
      },
      plotOptions: {
        networkgraph: {
          keys: ['from', 'to'],
          layoutAlgorithm: {
            enableSimulation: true,
            friction: -0.9
          }
        }
      },
      series: [{
        type: 'networkgraph',
        dataLabels: {
          enabled: true,
          linkFormat: '',
          style: {
            fontSize: '0.8em',
            fontWeight: 'normal'
          }
        },
        id: 'lang-tree',
        data: data
      }]
    });
    //console.log('renderChart called');
  }

  initPieChart() {
    Highcharts.chart('pie-container', {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Browser market shares. January, 2022',
        align: 'left'
      },
      subtitle: {
        text: 'Click the slices to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
        align: 'left'
      },
      accessibility: {
        announceNewData: {
          enabled: true
        },
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        type: 'pie', // Specify the type of series as 'pie'
        name: 'Browsers',
        data: [
          { name: 'Chrome', y: 61.04 },
          { name: 'Safari', y: 9.47 },
          { name: 'Edge', y: 9.32 },
          { name: 'Firefox', y: 8.15 },
          { name: 'Other', y: 11.02 }
        ]
      }]
    });
  }

  BarsChartSurfaces(){
    const data: surfaceData[] = []
    this.floorService.getZonesForEtage(15).subscribe(zones => {
      this.Locals = zones
      for (const local of this.Locals) {
        data.push({ name: local.nomLocal, y: local.surface })
      }
      this.surfaceData = data

      //console.log('affichage du chart ', data)
      Highcharts.chart('bars-container', {
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
          name: 'Surfaces',
          color: 'blue',
          data: this.surfaceData
        }]
      });
    });
  }


  pieChartSurfaces(){
    const data: surfaceData[] = []
    this.floorService.getZonesForEtage(15).subscribe(zones => {
      this.Locals = zones
      for (const local of this.Locals) {
        data.push({ name: local.nomLocal, y: local.surface })
      }
      this.surfaceData = data

      //console.log('affichage du chart ', data)
      Highcharts.chart('pie-surfaces', {
        data: {
          table: 'datatable'
        },
        chart: {
            type: 'column'
        },
        title: {
            text: 'Surfaces des locaux de l Ã©tage 1'
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
          type: 'pie', // Specify the type of series as 'pie'
          name: 'Surfaces',
          color: 'blue',
          data: this.surfaceData
        }]
      });
    });
  }

  consommationMoyenne(data: any[]){
    let i, somme:any=0;
    for (i = 0; i < 30; i++) {
      somme += data[i];
    }
    return somme / data.length;
  }

  consommationChart(){

    const data1: any[] = [];
    let i = 0;

    // Génération des valeurs aléatoires et calcul de la somme
    for (i = 0; i < 30; i++) {
      let valeur = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
      data1.push(valeur);
    }
    console.log(this.consommationMoyenne(data1))

    this.consommationChartOptions = {

      chart: {
        type: 'column'
    },
    title: {
        text: 'Exemple de graphique avec axe de temps'
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%e. %b',
            week: '%e. %b',
            month: '%b %Y',
            year: '%Y'
        },
        title: {
            text: 'Date/Heure'
        }
    },
    yAxis: {
        title: {
            text: 'Valeurs'
        }
    },
    series: [{
        name: 'Série 1',
        data: [
            [Date.UTC(2022, 0, 1), this.consommationMoyenne(data1)],
            [Date.UTC(2022, 1, 1), 20],
            [Date.UTC(2022, 2, 1), 15],
            // Ajoutez vos données ici au format [timestamp, valeur]
        ]
    }]

    }
  }



  getBatiments(){
    this.floorService.getAllBatiments().subscribe(batiments => {
      this.batiments =batiments;
    });
  }

  getEtages(){
    this.floorService.getAllEtages().subscribe(etages => {
      this.etages = etages;
      //console.log(this.etages)
    });
  }

  getLocaux(){
    this.floorService.getAllZones().subscribe(locaux => {
      this.locaux =locaux;
    });
  }

  choisirEtages : any = [];

  getEtagesParBatiments(batimentId: number){

    return this.floorService.getEtagesByBatiments(batimentId)
      .pipe(
        map(etages => etages),
        catchError(error => {
          console.error('Error getting etages:', error);
          return of('Not Found'); // Or another default value
        })
      );

    this.floorService.getEtagesByBatiments(batimentId).subscribe(etages => {
      //console.log('Etage de bat ', batimentId, ': ', etages);
      this.choisirEtages.push(etages);
    });
  }


  batimentsSelected: BatimentType[] = [];
  async onBatimentsCheckboxChange(event: any, batimentId: number) {
    const checked = event.target.checked;
    if (checked) {

      let Batiments: BatimentType[] = [] ;
      let _id: number, _nom: string;
      // récupérer id et nom du batiment
      this.getBatimentById(batimentId).subscribe((batiment) => {
        _id = batiment.id;
        _nom = batiment.nomBatiment;
      });
      // Récupérer les étage du batiment
      let _etages : EtageType[] = [], nbEtages: number;
      this.getEtagesParBatiments(batimentId).subscribe(async (etages) => {
        let  _locaux: any[] = [], nbLocaux: number;
        nbEtages = etages.length;
        let _etage: EtageType={infos:{}, locaux: []};
        etages.forEach((etage: any) => {
          //_infos = etage;
          _etage.infos = etage
          // Récupérer les locaux de chaque etage
          //etage.locaux = [];
          this.getLocauxParEtages(etage.id).subscribe((etagelocaux) => {
            _etage.locaux.push(etagelocaux)
            console.log('etage.locaux: ',etage.id, ' : ', _etage.locaux);
          });
          _etages.push(_etage);
        });
        // 1:
        //await new Promise(resolve => setTimeout(resolve, 10000));

        console.log('etages: ', _etages);
        this.batimentsSelected.push({id:_id, nom:_nom, etages: _etages});


      });
     /*  await new Promise(resolve => setTimeout(resolve, 10000));
      console.log('batimments all: ', this.batimentsSelected) */
    } else {
      // Supprimer ce batiments de batiments selectionnés
      this.batimentsSelected = this.batimentsSelected.filter((batiment: BatimentType) => {
        return batiment.id !== batimentId;
      });
    /*   await new Promise(resolve => setTimeout(resolve, 10000));
      console.log('batimments all: ', this.batimentsSelected) */
    }
  }

  /* batimentsSelected: any[] = [];
  onBatimentsCheckboxChange(event: any, batimentId: number) {
    const checked = event.target.checked;
    if (checked) {
      // Ajouter ce batiments aux batiments selectionnés
      this.getBatimentById(batimentId).subscribe(batiment => {
        this.batimentsSelected.push(batiment);
      });
      // Récupérer les étage de ce batiment et les ajouter à this.choisirEtages
      this.getEtagesParBatiments(batimentId);

    } else {
      // Supprimer ce batiments de batiments selectionnés
      this.batimentsSelected = this.batimentsSelected.filter((batiment: any) => {
        return batiment.id !== batimentId;
      });
      // supprimer les étage de ce batiment de this.choisirEtages
      this.choisirEtages = this.choisirEtages.filter((etages: any[]) => {
        return !etages.some((etage: any) => etage.batimentId === batimentId);
      });
    }
    console.log('choisirEtages: ',this.choisirEtages);
  } */

  etagesSelected: number[] = [];
  onEtagesCheckboxChange(event: any, etagetId: number) {
    const checked = event.target.checked;
    if (checked) {
      // Ajouter ce batiments aux batiments selectionnés
      this.getEtageById(etagetId).subscribe((etage: any) => {
        this.etagesSelected.push(etage);
      });
      // Récupérer les étage de ce batiment et les ajouter à this.choisirEtages
      //this.getEtagesParBatiments(etagetId);

    } else {
      // Supprimer ce batiments de batiments selectionnés
      this.etagesSelected = this.etagesSelected.filter((etage: any) => {
        return etage.id !== etagetId;
      });
      // supprimer les étage de ce batiment de this.choisirEtages
      this.choisirEtages = this.choisirEtages.filter((etages: any[]) => {
        return !etages.some((etage: any) => etage.batimentId === etagetId);
      });
    }
    console.log('Etages selected: ',this.etagesSelected);
  }

  /* onEtagesCheckboxChange(event: any, etageId: number) {
    const checked = event.target.checked;
    if (checked) {
      this.etagesSelected.push(etageId);
    } else {
      this.etagesSelected = this.etagesSelected.filter(id => id !== etageId);
    }
    console.log('Etages selected: ',this.etagesSelected);
  } */
  nomBat: string = '';

  getBatimentById(batimentId: number): Observable<any> {
    return this.floorService.getBatimentById(batimentId)
      .pipe(
        map(batiment => batiment),
        catchError(error => {
          console.error('Error getting batiment name:', error);
          return of('Not Found'); // Or another default value
        })
      );
  }

  getEtageById(etageId: number){
    let data : any;
    this.floorService.getEtageById(etageId).subscribe(etage => {
      data = etage;
    });
    return data;
  }

  getLocauxParEtages(etageId: number){
    return this.floorService.getZonesForEtage(etageId)
      .pipe(
        map(locaux => locaux),
        catchError(error => {
          console.error('Error getting locaux:', error);
          return of('Not Found'); // Or another default value
        })
      );

    this.floorService.getEtagesByBatiments(etageId).subscribe(locaux => {
      this.locaux = locaux;
      //console.log(this.etages)
    });
  }

}



/* avant import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_networkgraph from 'highcharts/modules/networkgraph';
import { FloorService } from '../service/floor.service';
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Equipement {
  id: number;
  nom?: string;

  etat: string;
  categorie: string;

  puissance: number;
  maxConsommation: number;
  minConsommation: number;
  zoneId: number;
}

interface Local {
  id: number;
  nomLocal: string;
  typeLocal: string;
  etageZ: number;
  surface: any;
}

interface Zone {
  id: number;
  name: string;
  etageZ: number;
  color: string;
}


interface surfaceData {
  name: string;
  y: any;
}
@Component({
  selector: 'app-graphe',
  templateUrl: './graphe.component.html',
  styleUrls: ['./graphe.component.css']
})
export class GrapheComponent implements OnInit, AfterViewInit {
  Highcharts = Highcharts;
  chartOptions: any;
  isLoggedIn: boolean;
  Locals : Local[] = []
  surfaceData: any
  consommationChartOptions: any;
  equipements: any;
  EquipementsLoading: boolean= false;
  EquipementAChercher :string|undefined;
  locaux: any;
  etages: any;
  batiments: any;

  constructor(private floorService: FloorService) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnInit() {
    this.getBatiments();
    this.getEtages();
    this.getLocaux();
    HC_networkgraph(Highcharts);
    //console.log('ngOnInit called');
    this.chartOptions = {
      chart: {
        type: 'area'
      },
      title: {
        text: 'Random DATA'
      },
      subtitle: {
        text: 'Demo'
      },
      tooltip: {
        split: true,
        valueSuffix: ' millions'
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true,
      },
      series: [{
        name: 'Ocean transport',
        data: [13234, 12729, 11533, 17798, 10398, 12811, 15483, 16196, 16214]
      }, {
        name: 'Households',
        data: [6685, 6535, 6389, 6384, 6251, 5725, 5631, 5047, 5039]

      }, {
        name: 'Agriculture and hunting',
        data: [4752, 4820, 4877, 4925, 5006, 4976, 4946, 4911, 4913]
      }, {
        name: 'Air transport',
        data: [3164, 3541, 3898, 4115, 3388, 3569, 3887, 4593, 1550]

      }, {
        name: 'Construction',
        data: [2019, 2189, 2150, 2217, 2175, 2257, 2344, 2176, 2186]
      }]
    };
  }

  ngAfterViewInit() {
    this.LoadEquipements()
    this.BarsChartSurfaces();
    this.initPieChart();
    this.pieChartSurfaces()
    /* this.floorService.getAllEtagesETZones().subscribe((data: any[]) => {
      //console.log('Combined Data:', data);
      this.renderChart(data);
    });
    console.log('ngAfterViewInit called'); */
    /*
    this.consommationChart()
    //this.EquipementConsommationChart()
  }

  private buildChartData(data: any[]): any[] {
      const chartData: { from: string, to: string, color: string }[] = [];

      data.forEach((item: any) => {
        const from = item[0];
        for (let i = 1; i < item.length; i++) {
          chartData.push({ from: from, to: item[i], color: '' }); // You might need to set the color property appropriately
        }
      });

      return chartData;
  }

  private renderChart(data: any[]): void {
    Highcharts.chart('container', {
      chart: {
        type: 'networkgraph',
        height: '100%'
      },
      title: {
        text: 'The Indo-European Language Tree',
        align: 'left'
      },
      subtitle: {
        text: 'A Force-Directed Network Graph in Highcharts',
        align: 'left'
      },
      plotOptions: {
        networkgraph: {
          keys: ['from', 'to'],
          layoutAlgorithm: {
            enableSimulation: true,
            friction: -0.9
          }
        }
      },
      series: [{
        type: 'networkgraph',
        dataLabels: {
          enabled: true,
          linkFormat: '',
          style: {
            fontSize: '0.8em',
            fontWeight: 'normal'
          }
        },
        id: 'lang-tree',
        data: data
      }]
    });
    //console.log('renderChart called');
  }

  initPieChart() {
    Highcharts.chart('pie-container', {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Browser market shares. January, 2022',
        align: 'left'
      },
      subtitle: {
        text: 'Click the slices to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
        align: 'left'
      },
      accessibility: {
        announceNewData: {
          enabled: true
        },
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        type: 'pie', // Specify the type of series as 'pie'
        name: 'Browsers',
        data: [
          { name: 'Chrome', y: 61.04 },
          { name: 'Safari', y: 9.47 },
          { name: 'Edge', y: 9.32 },
          { name: 'Firefox', y: 8.15 },
          { name: 'Other', y: 11.02 }
        ]
      }]
    });
  }

  BarsChartSurfaces(){
    const data: surfaceData[] = []
    this.floorService.getZonesForEtage(15).subscribe(zones => {
      this.Locals = zones
      for (const local of this.Locals) {
        data.push({ name: local.nomLocal, y: local.surface })
      }
      this.surfaceData = data

      //console.log('affichage du chart ', data)
      Highcharts.chart('bars-container', {
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
          name: 'Surfaces',
          color: 'blue',
          data: this.surfaceData
        }]
      });
    });
  }


  pieChartSurfaces(){
    const data: surfaceData[] = []
    this.floorService.getZonesForEtage(15).subscribe(zones => {
      this.Locals = zones
      for (const local of this.Locals) {
        data.push({ name: local.nomLocal, y: local.surface })
      }
      this.surfaceData = data

      //console.log('affichage du chart ', data)
      Highcharts.chart('pie-surfaces', {
        data: {
          table: 'datatable'
        },
        chart: {
            type: 'column'
        },
        title: {
            text: 'Surfaces des locaux de l Ã©tage 1'
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
          type: 'pie', // Specify the type of series as 'pie'
          name: 'Surfaces',
          color: 'blue',
          data: this.surfaceData
        }]
      });
    });
  }

  consommationMoyenne(data: any[]){
    let i, somme:any=0;
    for (i = 0; i < 30; i++) {
      somme += data[i];
    }
    console.log('data : ',somme )
    return somme / data.length;
  }

  consommationChart(){

    const data1: any[] = [];
    let i = 0;

    // Génération des valeurs aléatoires et calcul de la somme
    for (i = 0; i < 30; i++) {
      let valeur = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
      data1.push(valeur);
    }
    console.log(this.consommationMoyenne(data1))

    this.consommationChartOptions = {

      chart: {
        type: 'column'
    },
    title: {
        text: 'Exemple de graphique avec axe de temps'
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%e. %b',
            week: '%e. %b',
            month: '%b %Y',
            year: '%Y'
        },
        title: {
            text: 'Date/Heure'
        }
    },
    yAxis: {
        title: {
            text: 'Valeurs'
        }
    },
    series: [{
        name: 'Série 1',
        data: [
            [Date.UTC(2022, 0, 1), this.consommationMoyenne(data1)],
            [Date.UTC(2022, 1, 1), 20],
            [Date.UTC(2022, 2, 1), 15],
            // Ajoutez vos données ici au format [timestamp, valeur]
        ]
    }]

    }
  }

  LoadEquipements(){
    this.EquipementsLoading = true;
    this.floorService.getTousEquipementsConsommation()
      .subscribe(
        (data: any[]) => {
          this.EquipementsLoading = false;
          this.equipements = data;
        });
  }


  EquipementConsommationChart(){
    let conData: any[] = []
    //load equipements:
    this.floorService.getTousEquipementsConsommation()
      .subscribe(
        (data: any[]) => {
          this.equipements = data;
          for (const e of this.equipements) {
            conData.push({ name: e.nom, y: e.consommation_totale })
          }
          Highcharts.chart('EConsommation', {

            chart: {
                type: 'column'
            },
            title: {
                text: 'Surfaces des locaux de l Ã©tage 1'
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
              name: 'Surfaces',
              color: 'blue',
              data: conData
            }]

          });

        },
        (error: any) => {
          console.error('Erreur lors de la récupération des équipements :', error);
        }
      );

  }

  getBatiments(){
    this.floorService.getAllBatiments().subscribe(batiments => {
      this.batiments =batiments;
      //console.log('batiiii : ',this.batiments)
    });
  }

  getEtages(){
    this.floorService.getAllEtages().subscribe(etages => {
      this.etages = etages;
      //console.log(this.etages)
    });
  }

  getLocaux(){
    this.floorService.getAllZones().subscribe(locaux => {
      this.locaux =locaux;
    });
  }

  batimentsSelected: number[] = [];
  choisirEtages : any[] = [];
  getEtagesParBatiments(batimentId: number){

    this.floorService.getEtagesByBatiments(batimentId).subscribe(etages => {
      this.choisirEtages.push(etages);
      console.log('choisir etages : ', this.choisirEtages)
    });
  }

  onBatimentsCheckboxChange(event: any, batimentId: number) {
    const checked = event.target.checked;
    if (checked) {
      this.batimentsSelected.push(batimentId);
    } else {
      this.batimentsSelected = this.batimentsSelected.filter(id => id !== batimentId);
    }
    this.batimentsSelected.forEach(batiment => {
      this.choisirEtages = [];
      this.getEtagesParBatiments(batiment);
    });
    console.log('Bats selected: ',this.batimentsSelected);
  }

  etagesSelected: number[] = [];

  onEtagesCheckboxChange(event: any, etageId: number) {
    const checked = event.target.checked;
    if (checked) {
      this.etagesSelected.push(etageId);
    } else {
      this.etagesSelected = this.etagesSelected.filter(id => id !== etageId);
    }
    console.log('Etages selected: ',this.etagesSelected);
  }

   getBatimentById(batimentId: number){
    let data: any;
    this.floorService.getBatimentById(batimentId).subscribe(batiment => {
      data = batiment;
    });
    return data;
  }

  getEtageById(etageId: number){
    let data : any;
    this.floorService.getEtageById(etageId).subscribe(etage => {
      data = etage;
    });
    return data;
  }

  getLocauxParEtages(etageId: number){
    this.floorService.getEtagesByBatiments(etageId).subscribe(locaux => {
      this.locaux = locaux;
      //console.log(this.etages)
    });
  }


}

*/
/* avant avant import { Component, OnInit, AfterViewInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import HC_networkgraph from 'highcharts/modules/networkgraph';
import HC_exporting from 'highcharts/modules/exporting';
import { FloorService } from '../service/floor.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importer l'opérateur map
interface Local {
  id: number;
  nomLocal: string;
  typeLocal: string;
  etageZ: number;
  surface: any;
};

interface surfaceData {
  name: string;
  y: any;
};
@Component({
  selector: 'app-graphe',
  templateUrl: './graphe.component.html',
  styleUrls: ['./graphe.component.css']
})
export class GrapheComponent implements OnInit, AfterViewInit {
  chartOptions: any;
  Highcharts = Highcharts;
  isLoggedIn: boolean;
  Locals : Local[] = []
  surfaceData: any
  networkData: any

  constructor(private floorService: FloorService) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnInit() {

    // Initialize the networkgraph module
    HC_networkgraph(Highcharts);
    this.surfaceData= this.floorService.getAllEtagesETZones()
    // Set up chart options
    this.chartOptions = {
      chart: {
        type: 'area'
      },
      title: {
        text: 'Random DATA'
      },
      subtitle: {
        text: 'Demo'
      },
      tooltip: {
        split: true,
        valueSuffix: ' millions'
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true,
      },
      series: [{
        name: 'Ocean transport',
        data: [13234, 12729, 11533, 17798, 10398, 12811, 15483, 16196, 16214]
      }, {
        name: 'Households',
        data: [6685, 6535, 6389, 6384, 6251, 5725, 5631, 5047, 5039]

      }, {
        name: 'Agriculture and hunting',
        data: [4752, 4820, 4877, 4925, 5006, 4976, 4946, 4911, 4913]
      }, {
        name: 'Air transport',
        data: [3164, 3541, 3898, 4115, 3388, 3569, 3887, 4593, 1550]

      }, {
        name: 'Construction',
        data: [2019, 2189, 2150, 2217, 2175, 2257, 2344, 2176, 2186]
      }]
    };
  }


  ngAfterViewInit() {
    const floors: Observable<any[]> = this.floorService.getAllEtages(); // Observable émettant des tableaux d'objets d'étage
    const zones: Observable<any[]> = this.floorService.getAllZones(); // Observable émettant des tableaux d'objets de zone

    // Construire les données pour le graphique
    const data: { from: string, to: string, color: string }[] = [];


    // Ajouter les étages au graphique
    floors.forEach((floor: any[]) => {
      data.push({
        from: 'hospital', // Ou tout autre nœud parent que vous voulez utiliser
        to: floor[0].nomEtage, // Nom de l'étage
        color: floor[0].color // Couleur de l'étage (assurez-vous que cette propriété est définie)
      });

      // Ajouter les zones pour cet étage
      zones.pipe(
        map((z: any[]) => z.filter((zone: any) => zone.etageZ === floor[0].id))
      ).subscribe((filteredZones: any[]) => {
        filteredZones.forEach((zone: any) => {
          data.push({
            from: floor[0].nomEtage, // Nom de l'étage
            to: zone.name, // Nom de la zone
            color: zone.color // Couleur de la zone (assurez-vous que cette propriété est définie)
          });
        });
      });
    });
    // Set up default colors
    this.BarsChartSurfaces();
    this.initPieChart();
    this.pieChartSurfaces()
    const defaultColors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'];

    // Get colors from Highcharts options, use default if undefined
    const colors = Highcharts.getOptions().colors || defaultColors;

    // Initialize nodes object with an index signature
    const nodes: { [key: string]: any } = {};

    // Add event listener for afterSetOptions event
    Highcharts.addEvent(
      Highcharts.Series,
      'afterSetOptions',
      (e: any) => {
        // Get colors again inside the event handler
        const colors = Highcharts.getOptions().colors || defaultColors;

        // Ensure nodes object is re-initialized inside the event handler
        const nodes: { [key: string]: any } = {};

        const series = (e && e.options) || {};
        let i = 0;

        if (series.type === 'networkgraph' && series.id === 'lang-tree') {
          series.data.forEach((link: [string, string]) => {
            if (link[0] === 'hospital') {
              nodes['hospital'] = {
                id: 'hospital',
                marker: {
                  radius: 20
                }
              };
              nodes[link[1]] = {
                id: link[1],
                marker: {
                  radius: 10
                },
                color: colors[i++ % colors.length] // Use modulo to cycle through colors array
              };
            } else if (nodes[link[0]] && nodes[link[0]].color) {
              nodes[link[1]] = {
                id: link[1],
                color: nodes[link[0]].color
              };
            }
          });

          series.nodes = Object.keys(nodes).map((id) => nodes[id]);
        }
      }
    );

    // Initialize the chart with Highcharts.chart method
    Highcharts.chart('container', {
      chart: {
        type: 'networkgraph',
        height: '100%'
      },
      title: {
        text: 'The Indo-European Language Tree',
        align: 'left'
      },
      subtitle: {
        text: 'A Force-Directed Network Graph in Highcharts',
        align: 'left'
      },
      plotOptions: {
        networkgraph: {
          keys: ['from', 'to'],
          layoutAlgorithm: {
            enableSimulation: true,
            friction: -0.9
          }
        }
      },
      series: [{
        type: 'networkgraph',
        dataLabels: {
          enabled: true,
          linkFormat: '',
          style: {
            fontSize: '0.8em',
            fontWeight: 'normal'
          }
        },
        id: 'lang-tree',
        data: [
          ['Proto Indo-European', 'Balto-Slavic'],
          ['Proto Indo-European', 'Germanic'],
          ['Proto Indo-European', 'Celtic'],
          ['Proto Indo-European', 'Italic'],
          ['Proto Indo-European', 'Hellenic'],
          ['Proto Indo-European', 'Anatolian'],
          ['Proto Indo-European', 'Indo-Iranian'],
          ['Proto Indo-European', 'Tocharian'],
          ['Indo-Iranian', 'Dardic'],
          ['Indo-Iranian', 'Indic'],
          ['Indo-Iranian', 'Iranian'],
          ['Iranian', 'Old Persian'],
        ]
      }]
    });
  }
  initPieChart() {
    Highcharts.chart('pie-container', {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Browser market shares. January, 2022',
        align: 'left'
      },
      subtitle: {
        text: 'Click the slices to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
        align: 'left'
      },
      accessibility: {
        announceNewData: {
          enabled: true
        },
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        type: 'pie', // Specify the type of series as 'pie'
        name: 'Browsers',
        data: [
          { name: 'Chrome', y: 61.04 },
          { name: 'Safari', y: 9.47 },
          { name: 'Edge', y: 9.32 },
          { name: 'Firefox', y: 8.15 },
          { name: 'Other', y: 11.02 }
        ]
      }]
    });
  }

  BarsChartSurfaces(){
    const data: surfaceData[] = []
    this.floorService.getZonesForEtage(15).subscribe(zones => {
      this.Locals = zones
      for (const local of this.Locals) {
        data.push({ name: local.nomLocal, y: local.surface })
      }
      this.surfaceData = data

      //console.log('affichage du chart ', data)
      Highcharts.chart('bars-container', {
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
          type: 'bar', // Specify the type of series as 'pie'
          name: 'Surfaces',
          color: 'blue',
          data: this.surfaceData
        }]
      });
    });
  }


  pieChartSurfaces(){
    const data: surfaceData[] = []
    this.floorService.getZonesForEtage(15).subscribe(zones => {
      this.Locals = zones
      for (const local of this.Locals) {
        data.push({ name: local.nomLocal, y: local.surface })
      }
      this.surfaceData = data

      //console.log('affichage du chart ', data)
      Highcharts.chart('pie-surfaces', {
        data: {
          table: 'datatable'
        },
        chart: {
            type: 'column'
        },
        title: {
            text: 'Surfaces des locaux de l Ã©tage 1'
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
          type: 'pie', // Specify the type of series as 'pie'
          name: 'Surfaces',
          color: 'blue',
          data: this.surfaceData
        }]
      });
    });
  }



}
*/