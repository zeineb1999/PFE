/*import { Component, OnInit } from '@angular/core';
import { FloorService } from  'src/app/service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'; // Importez Location depuis @angular/common

import * as Highcharts from 'highcharts';
import treemap from 'highcharts/modules/treemap';
import treegraph from 'highcharts/modules/treegraph';
treemap(Highcharts);
treegraph(Highcharts);
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

interface HighchartsData {
  id: string;
  parent: string;
  name: string;
}

@Component({
  selector: 'app-toutes-zones',
  templateUrl: './toutes-zones.component.html',
  styleUrls: ['./toutes-zones.component.css']
})
export class ToutesZonesComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  
  
  demandeSuppressionEtage: boolean = false;
  demandeSuppressionZone: boolean = false;
  etagesArchi: any[] = [];
  etages: any[] = [];
  locals: any[] = [];
  batiments: any[] = [];
  isLoggedIn: boolean;
  constructor(private floorService:FloorService,private route: ActivatedRoute, private router: Router,private location: Location) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

   }
   generateRandomColor(): string {
    // Génération de trois composants RGB aléatoires
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Retourne la couleur au format RGB
    return `rgb(${r}, ${g}, ${b})`;
  }
  ngOnInit(): void {
    this.floorService.getAllEtages().subscribe(etages => {
      this.etages = etages;
      console.log(this.etages)
    });
    this.floorService.getAllZones().subscribe(locals => {
      this.locals =locals;
      console.log(this.locals)
    });
    this.floorService.getAllBatiments().subscribe(batiments => {
      this.batiments =batiments;
      console.log(this.batiments)
    });
    let indexI = 1;

this.batiments.forEach((batiment) => {
  data2.push({
    id: '1.' + indexI,
    parent: '0.0',
    name: batiment.nomBatiment
  });

  let indexJ = 1; // Initialisation de indexJ pour chaque nouveau bâtiment

  this.etages.forEach((etage) => {
    if (etage.batimentId === batiment.id) {
      data2.push({
        id: '1.' + indexJ,
        parent: '1.' + indexI,
        name: etage.nomEtage
      });

      indexJ++; // Incrémenter indexJ pour chaque étage trouvé
    }
  });

  indexI++; // Incrémenter indexI pour passer au prochain bâtiment
});


    
      const data2 = [
        {
            id: '0.0',
            parent: '',
            name: 'Hospital'
        },
        {
            id: '1.3',
            parent: '0.0',
            name: 'Asia'
        },
        {
            id: '1.1',
            parent: '0.0',
            name: 'Services Medicaux Specialises'
        },
        {
            id: '1.2',
            parent: '0.0',
            name: 'America'
        },
        {
            id: '1.4',
            parent: '0.0',
            name: 'Europe'
        },
        {
            id: '1.5',
            parent: '0.0',
            name: 'Oceanic'
        },
       
        {
            id: '2.1',
            parent: '1.1',
            name: 'Eastern Africa'
        },
        {
            id: '2.5',
            parent: '1.1',
            name: 'Western Africa'
        },
        {
            id: '2.3',
            parent: '1.1',
            name: 'North Africa'
        },
        {
            id: '2.2',
            parent: '1.1',
            name: 'Central Africa'
        },
        {
          id: '2.1',
          parent: '1.3',
          name: 'Eastern Assia'
      },
        // Ajoutez le reste de vos données ici
      ];
  
      this.chartOptions = {
        title: {
            text: 'Architecture de l hopital'
        },
        series: [
            {
                type: 'treegraph',
                data: data2,
                tooltip: {
                    pointFormat: '{point.name}'
                },
                marker: {
                    symbol: 'rect',
                    width: 100
                   
                },
                dataLabels: {
                    format: '{point.name}',
                    style: {
                        whiteSpace: 'nowrap'
                    }
                },
                levels: [
                  {
                      level: 1,
                      layoutAlgorithm: 'sliceAndDice'
                  },
                  {
                      level: 2,
                      layoutAlgorithm: 'sliceAndDice',
                      colorVariation: {
                          key: 'brightness',
                          to: -0.5
                      }
                  },
                  {
                      level: 3,
                      layoutAlgorithm: 'sliceAndDice',
                      colorVariation: {
                          key: 'brightness',
                          to: 0.5
                      }
                  }
              ]
              
           
            }
        ]
        
      };
    }

  fetchZonesForEtage(etageId: number): void {
    const etage = this.etages.find(e => e.id === etageId);
    if (etage) {
      this.floorService.getZonesForEtage(etageId).subscribe(zones => {
        etage.zones = zones;
        etage.showZones = true;
      });
    }
  }
  hideZonesForEtage(etageId: number): void {
    const etage = this.etages.find(e => e.id === etageId);
    if (etage) {
      this.floorService.getZonesForEtage(etageId).subscribe(zones => {
        etage.zones = zones;
        etage.showZones = false;
        console.log("clicked");
      });
    }
  }
  redirectToZoneDetails(zoneId: number): void {
    this.router.navigate(['/zone-details', zoneId]);
  }

  redirectToAjouterZone(etageId: number): void {
    // Redirigez vers le composant d'ajout d'équipement en passant l'ID de la zone dans l'URL
    this.router.navigate(['/ajouterZone', etageId]);
  }

  redirectToZoneEquipemets(zoneId: number): void {
    // Redirigez vers le composant d'ajout d'équipement en passant l'ID de la zone dans l'URL
    this.router.navigate(['/equipements', zoneId]);
  }



  updateEtage(etageId: number): void {
    this.router.navigate(['/updateEtage',etageId]);
  }

  // Supprimer étage

  demanderSuppEtage(etageId:number): void{
    this.demandeSuppressionEtage = true;
  }

  annulerSuppressionEtage(etageId:number): void{
    this.demandeSuppressionEtage = false;
  }

  deleteEtage(etageId: number): void {
    this.floorService.deleteEtage(etageId).subscribe(() => {
      // Redirigez vers la même page pour rafraîchir
      window.location.reload();
    });
    this.demandeSuppressionEtage = false;
  }

  // Supprimer zone

  demanderSuppZone(etageId:number): void{
    this.demandeSuppressionZone = true;
  }

  annulerSuppressionZone(etageId:number): void{
    this.demandeSuppressionZone = false;
  }

  deleteZone(zoneId: number): void {
    this.floorService.deleteZone(zoneId).subscribe(() => {
      // Redirigez vers la même page pour rafraîchir
      window.location.reload();
    });
    this.demandeSuppressionZone = false;
  }



  updateZone(zoneId: number): void {
    this.router.navigate(['/updateZone',zoneId]);
  }



}*/


import { Component, OnInit , AfterViewInit} from '@angular/core';
import { FloorService } from  'src/app/service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'; // Importez Location depuis @angular/common

import * as Highcharts from 'highcharts';
import treemap from 'highcharts/modules/treemap';
import treegraph from 'highcharts/modules/treegraph';

import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs';

import HC_exporting from 'highcharts/modules/exporting';
import HC_networkgraph from 'highcharts/modules/networkgraph';
import { map } from 'rxjs/operators';

interface HighchartsData {
  id: string;
  parent: string;
  name: string;
}

@Component({
  selector: 'app-toutes-zones',
  templateUrl: './toutes-zones.component.html',
  styleUrls: ['./toutes-zones.component.css']
})
export class ToutesZonesComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions:any;

  demandeSuppressionEtage: boolean = false;
  demandeSuppressionZone: boolean = false;
  etagesArchi: any[] = [];
  etages: any[] = [];
  locals: any[] = [];
  batiments: any[] = [];
  isLoggedIn: boolean;

  constructor(private floorService: FloorService, private route: ActivatedRoute, private router: Router, private location: Location) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  generateRandomColor(): string {
    // Génération de trois composants RGB aléatoires
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Retourne la couleur au format RGB
    return `rgb(${r}, ${g}, ${b})`;
 }
 ngOnInit(): void {
  this.floorService.getAllEtages().subscribe(etages => {
    this.etages = etages;
    console.log(this.etages)
  });
  this.floorService.getAllZones().subscribe(locals => {
    this.locals =locals;
    console.log(this.locals)
  });
  this.floorService.getAllBatiments().subscribe(batiments => {
    this.batiments =batiments;
    console.log(this.batiments)
  });
  treemap(Highcharts);
  treegraph(Highcharts);
}

  ngAfterViewInit(){
    this.floorService.getAllEtagesETZonesArchi().subscribe((data:any[])=>{
      console.log('combinedData:', data);
      this.renderChart(data);
    })
  }
 
  private renderChart(data: any[]): void {
    (Highcharts as any).chart({
      chart: {
        renderTo: 'container', // Identifiant de l'élément HTML où le graphique sera rendu
        type: 'treegraph',
        spacingBottom: 30,
        marginRight: 250,
        height: 1200
      },
      title: {
        text: ''
      },
      series: [{
        type: 'treegraph',
        keys: ['parent', 'id', 'level'],
        clip: false,
        data: data,
        marker: {
          symbol: 'circle',
          radius: 6,
          fillColor: '#ffffff',
          lineWidth: 3
        },
        dataLabels: {
          align: 'left',
          pointFormat: '{point.name}',
          style: {
            color: '#000000',
            textOutline: '3px #ffffff',
            whiteSpace: 'nowrap'
          },
          x: 24,
          crop: false,
          overflow: 'none'
        },
        levels: [
          {
            level: 1,
            levelIsConstant: false
          },
          {
            level: 2,
            colorByPoint: true
          },
          {
            level: 3,
            colorVariation: {
              key: 'brightness',
              to: -0.5
            }
          },
          {
            level: 4,
            colorVariation: {
              key: 'brightness',
              to: 0.5
            }
          },
          {
            level: 6,
            dataLabels: {
              x: 10
            },
            marker: {
              radius: 4
            }
          }
        ]
      }] as any
    });
    console.log('renderChart called');
}


  fetchZonesForEtage(etageId: number): void {
    const etage = this.etages.find(e => e.id === etageId);
    if (etage) {
      this.floorService.getZonesForEtage(etageId).subscribe(zones => {
        etage.zones = zones;
        etage.showZones = true;
      });
    }
  }
  hideZonesForEtage(etageId: number): void {
    const etage = this.etages.find(e => e.id === etageId);
    if (etage) {
      this.floorService.getZonesForEtage(etageId).subscribe(zones => {
        etage.zones = zones;
        etage.showZones = false;
        console.log("clicked");
      });
    }
  }
  redirectToZoneDetails(zoneId: number): void {
    this.router.navigate(['/zone-details', zoneId]);
  }

  redirectToAjouterZone(etageId: number): void {
    // Redirigez vers le composant d'ajout d'équipement en passant l'ID de la zone dans l'URL
    this.router.navigate(['/ajouterZone', etageId]);
  }

  redirectToZoneEquipemets(zoneId: number): void {
    // Redirigez vers le composant d'ajout d'équipement en passant l'ID de la zone dans l'URL
    this.router.navigate(['/equipements', zoneId]);
  }



  updateEtage(etageId: number): void {
    this.router.navigate(['/updateEtage',etageId]);
  }

  // Supprimer étage

  demanderSuppEtage(etageId:number): void{
    this.demandeSuppressionEtage = true;
  }

  annulerSuppressionEtage(etageId:number): void{
    this.demandeSuppressionEtage = false;
  }

  deleteEtage(etageId: number): void {
    this.floorService.deleteEtage(etageId).subscribe(() => {
      // Redirigez vers la même page pour rafraîchir
      window.location.reload();
    });
    this.demandeSuppressionEtage = false;
  }

  // Supprimer zone

  demanderSuppZone(etageId:number): void{
    this.demandeSuppressionZone = true;
  }

  annulerSuppressionZone(etageId:number): void{
    this.demandeSuppressionZone = false;
  }

  deleteZone(zoneId: number): void {
    this.floorService.deleteZone(zoneId).subscribe(() => {
      // Redirigez vers la même page pour rafraîchir
      window.location.reload();
    });
    this.demandeSuppressionZone = false;
  }



  updateZone(zoneId: number): void {
    this.router.navigate(['/updateZone',zoneId]);
  }



}
