import { Component, OnInit, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
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
  structure: string = 'table';
  DesactiverBatiment:boolean=false;
  activerBatiment:boolean=false;
  DesactiverEtage:boolean=false;
  activerEtage:boolean=false;
  DesactiverZone:boolean=false;
  activerZone:boolean=false;
  idSelectionne:number=0;
  raison:string="";
  data: any[]=[];
  role:any;
  id:any;
  selectedReason: string = '';
  constructor(private floorService: FloorService, private route: ActivatedRoute, private router: Router, private location: Location, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    console.log(this.isLoggedIn)
  }

  generateRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r}, ${g}, ${b})`;
 }
  ngOnInit(): void {
  this.role = sessionStorage.getItem('role');
  this.id= sessionStorage.getItem('id');

  this.floorService.getAllBatiments().subscribe(batiments => {
    this.batiments = batiments;
    console.log(this.batiments)
  })
  this.floorService.getAllEtages().subscribe(etages => {
    this.etages = etages;
    console.log(this.etages)
  });
  this.floorService.getAllZones().subscribe(locals => {
    this.locals =locals;
    console.log(this.locals)
  });

  treemap(Highcharts);
  treegraph(Highcharts);
}

handleToggleOn(batimentId: number): void {
      this.idSelectionne=batimentId;
      this.activerBatiment=true;
}
confirmerActiverBatiment(){
  const maDate = new Date();
      const annee = maDate.getUTCFullYear();
      const mois = String(maDate.getUTCMonth() + 1).padStart(2, '0');
      const jour = String(maDate.getUTCDate()).padStart(2, '0');
      let heures=''
      if (maDate.getUTCHours() < 23) {
      heures = String(maDate.getUTCHours()+1).padStart(2, '0');
      } else {
      heures = '00'.padStart(2, '0');
      }
      
      const minutes = String(maDate.getUTCMinutes()).padStart(2, '0');
      const secondes = String(maDate.getUTCSeconds()).padStart(2, '0');
      const millisecondes = String(maDate.getUTCMilliseconds()).padStart(3, '0');
      
      const dateFormatee = `${annee}-${mois}-${jour} ${heures}:${minutes}:${secondes}`;
  console.log(`Toggle is ON for batiment ID: ${this.idSelectionne}`);
  this.floorService.ActiverBatiment(this.idSelectionne,dateFormatee).subscribe(any => {
    
    this.floorService.HistoriqueBatiment('activer',this.idSelectionne,dateFormatee,this.id,'').subscribe(any=>{

    }) 
    this.activerBatiment=false;
    this.idSelectionne=0;window.location.reload();
  })

}


annulerActiverBatiment(){
  this.DesactiverBatiment=false;
  this.idSelectionne=0;

}

handleToggleOff(batimentId: number): void {
  this.idSelectionne=batimentId;
  this.DesactiverBatiment=true;
  /* const maDate = new Date();
  const annee = maDate.getUTCFullYear();
  const mois = String(maDate.getUTCMonth() + 1).padStart(2, '0');
  const jour = String(maDate.getUTCDate()).padStart(2, '0');
  let heures=''
  if (maDate.getUTCHours() < 23) {
  heures = String(maDate.getUTCHours()+1).padStart(2, '0');
  } else {
  heures = '00'.padStart(2, '0');
  }
  
  const minutes = String(maDate.getUTCMinutes()).padStart(2, '0');
  const secondes = String(maDate.getUTCSeconds()).padStart(2, '0');
  const millisecondes = String(maDate.getUTCMilliseconds()).padStart(3, '0');
  
  const dateFormatee = `${annee}-${mois}-${jour} ${heures}:${minutes}:${secondes}`;
  console.log(`Toggle is OFF for batiment ID: ${batimentId}`);
  this.floorService.DesactiverBatiment(batimentId,dateFormatee).subscribe(any => {
    window.location.reload();
  }) */
  // Appeler la méthode pour l'état OFF
  // Par exemple : appeler une fonction ou envoyer une requête HTTP avec l'ID du bâtiment
}
confirmerDesactiverBatiment(){
  const maDate = new Date();
  const annee = maDate.getUTCFullYear();
  const mois = String(maDate.getUTCMonth() + 1).padStart(2, '0');
  const jour = String(maDate.getUTCDate()).padStart(2, '0');
  let heures=''
  if (maDate.getUTCHours() < 23) {
  heures = String(maDate.getUTCHours()+1).padStart(2, '0');
  } else {
  heures = '00'.padStart(2, '0');
  }
  
  const minutes = String(maDate.getUTCMinutes()).padStart(2, '0');
  const secondes = String(maDate.getUTCSeconds()).padStart(2, '0');
  const millisecondes = String(maDate.getUTCMilliseconds()).padStart(3, '0');
  
  const dateFormatee = `${annee}-${mois}-${jour} ${heures}:${minutes}:${secondes}`;
  console.log(`Toggle is ON for batiment ID: ${this.idSelectionne}`);
  this.floorService.DesactiverBatiment(this.idSelectionne,dateFormatee).subscribe(any => {
    let reason
    if(this.selectedReason==='Autre'){
      reason= this.raison
    }
    else{
      reason=this.selectedReason
    }
    console.log('raison',reason)
    this.floorService.HistoriqueBatiment('desactiver',this.idSelectionne,dateFormatee,this.id,reason).subscribe(any=>{
      
    })
    window.location.reload();
    this.DesactiverBatiment=false;
  })

}
annulerDesactiverBatiment(){
  this.DesactiverBatiment=false;
  this.idSelectionne=0;

}

handleToggleOnEtage(batimentId: number): void {
  this.idSelectionne=batimentId;
  this.activerEtage=true
      
  }
confirmerActiverEtage(){
  const maDate = new Date();
      const annee = maDate.getUTCFullYear();
      const mois = String(maDate.getUTCMonth() + 1).padStart(2, '0');
      const jour = String(maDate.getUTCDate()).padStart(2, '0');
      let heures=''
      if (maDate.getUTCHours() < 23) {
      heures = String(maDate.getUTCHours()+1).padStart(2, '0');
      } else {
      heures = '00'.padStart(2, '0');
      }
      
      const minutes = String(maDate.getUTCMinutes()).padStart(2, '0');
      const secondes = String(maDate.getUTCSeconds()).padStart(2, '0');
      const millisecondes = String(maDate.getUTCMilliseconds()).padStart(3, '0');
      
      const dateFormatee = `${annee}-${mois}-${jour} ${heures}:${minutes}:${secondes}`;
  console.log(`Toggle is ON for batiment ID: ${this.idSelectionne}`);
  this.floorService.ActiverEtage(this.idSelectionne,dateFormatee).subscribe(any => {
   
    this.floorService.HistoriqueEtage('activer',this.idSelectionne,dateFormatee,this.id,'').subscribe(any=>{
      
    })
    
    this.activerEtage=false;
    this.idSelectionne=0;
    window.location.reload();
  })

}


annulerActiverEtage(){
  this.activerEtage=false;
  this.idSelectionne=0;

}
handleToggleOffEtage(batimentId: number): void {
 
  this.idSelectionne=batimentId;
  this.DesactiverEtage=true
}
confirmerDesactiverEtage(){
  const maDate = new Date();
  const annee = maDate.getUTCFullYear();
  const mois = String(maDate.getUTCMonth() + 1).padStart(2, '0');
  const jour = String(maDate.getUTCDate()).padStart(2, '0');
  let heures=''
  if (maDate.getUTCHours() < 23) {
  heures = String(maDate.getUTCHours()+1).padStart(2, '0');
  } else {
  heures = '00'.padStart(2, '0');
  }
  
  const minutes = String(maDate.getUTCMinutes()).padStart(2, '0');
  const secondes = String(maDate.getUTCSeconds()).padStart(2, '0');
  const millisecondes = String(maDate.getUTCMilliseconds()).padStart(3, '0');
  
  const dateFormatee = `${annee}-${mois}-${jour} ${heures}:${minutes}:${secondes}`;
  console.log(`Toggle is ON for batiment ID: ${this.idSelectionne}`);
  this.floorService.DesactiverEtage(this.idSelectionne,dateFormatee).subscribe(any => {
    let reason
    if(this.selectedReason==='Autre'){
      reason= this.raison
    }
    else{
      reason=this.selectedReason
    }
    console.log('raison',reason)
    this.floorService.HistoriqueEtage('desactiver',this.idSelectionne,dateFormatee,this.id,reason).subscribe(any=>{
      
    })
    window.location.reload();
    this.DesactiverEtage=false;
  })

}
annulerDesactiverEtage(){
  this.DesactiverEtage=false;
  this.idSelectionne=0;

}


handleToggleOnZone(batimentId: number): void {
      const maDate = new Date();
      const annee = maDate.getUTCFullYear();
      const mois = String(maDate.getUTCMonth() + 1).padStart(2, '0');
      const jour = String(maDate.getUTCDate()).padStart(2, '0');
      let heures=''
      if (maDate.getUTCHours() < 23) {
      heures = String(maDate.getUTCHours()+1).padStart(2, '0');
      } else {
      heures = '00'.padStart(2, '0');
      }
      
      const minutes = String(maDate.getUTCMinutes()).padStart(2, '0');
      const secondes = String(maDate.getUTCSeconds()).padStart(2, '0');
      const millisecondes = String(maDate.getUTCMilliseconds()).padStart(3, '0');
      
      const dateFormatee = `${annee}-${mois}-${jour} ${heures}:${minutes}:${secondes}`;
  console.log(`Toggle is ON for batiment ID: ${batimentId}`);
  this.floorService.ActiverZone(batimentId,dateFormatee).subscribe(any => {
    window.location.reload();
  })
 
  // Appeler la méthode pour l'état ON
  // Par exemple : appeler une fonction ou envoyer une requête HTTP avec l'ID du bâtiment
}

handleToggleOffZone(batimentId: number): void {
  const maDate = new Date();
  const annee = maDate.getUTCFullYear();
  const mois = String(maDate.getUTCMonth() + 1).padStart(2, '0');
  const jour = String(maDate.getUTCDate()).padStart(2, '0');
  let heures=''
  if (maDate.getUTCHours() < 23) {
  heures = String(maDate.getUTCHours()+1).padStart(2, '0');
  } else {
  heures = '00'.padStart(2, '0');
  }
  
  const minutes = String(maDate.getUTCMinutes()).padStart(2, '0');
  const secondes = String(maDate.getUTCSeconds()).padStart(2, '0');
  const millisecondes = String(maDate.getUTCMilliseconds()).padStart(3, '0');
  
  const dateFormatee = `${annee}-${mois}-${jour} ${heures}:${minutes}:${secondes}`;
  console.log(`Toggle is OFF for batiment ID: ${batimentId}`);
  this.floorService.DesactiverZone(batimentId,dateFormatee).subscribe(any => {
    window.location.reload();
  })
  
  // Appeler la méthode pour l'état OFF
  // Par exemple : appeler une fonction ou envoyer une requête HTTP avec l'ID du bâtiment
}

  ngAfterViewInit(){
    this.floorService.getAllEtagesETZonesArchi().subscribe((data: any[]) => {
      this.data = data
      console.log('combinedData:', data);
      if (this.structure == 'arbre') {
      this.renderChart(this.data);
    } else {
      this.el.nativeElement.querySelector('#s-container').innerHTML = ''
    }
      //this.renderChart(this.data);
    })
  }

  private renderChart(data: any[]): void {
    (Highcharts as any).chart({
      chart: {
        renderTo: 's-container',
        type: 'treegraph',
        spacingBottom: 30,
        marginRight: 250,
        //height: 1200,
        background: 'transparent'
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

  getEtagesForBatiment(batimentId: number):any[] {
    return this.etages.filter(etage => etage.batimentId === batimentId);
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
  redirectToAjouterEtage(batimentId: number): void {
    // Redirigez vers le composant d'ajout d'équipement en passant l'ID de la zone dans l'URL
    this.router.navigate(['/ajouterEtage', batimentId]);
  }
  redirectToAjouterBatiment(): void {
    this.router.navigate(['/ajouterBatiment']);

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

  updateStructure(S: string) {
    this.structure = S
    console.log('s:', this.structure)
    if (S == 'arbre') {
      this.renderChart(this.data);
    } else {
      this.el.nativeElement.querySelector('#s-container').innerHTML = ''
    }
  }



}