import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_networkgraph from 'highcharts/modules/networkgraph';
import { FloorService } from '../../service/floor.service';
import { forkJoin, of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-equipements-list2',
  templateUrl: './equipements-list2.component.html',
  styleUrls: ['./equipements-list2.component.css']
})
export class EquipementsList2Component {
  constructor(private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  isLoggedIn: boolean;
  EquipementsLoading: Boolean = true;
  EquipementAChercher :string|undefined;

  @Input() equipements: any[] = [];
  @Input() dateDebut: string = '';
  @Input() heureDebut: string = '';
  @Input() dateFin: string = '';
  @Input() heureFin: string = '';

  ngOnChanges() {
    if(this.equipements){

      if(this.equipements.length == 0) {
        this.EquipementsLoading = true;
      } else {
        this.EquipementsLoading = false;
      }

    } else {
      this.EquipementsLoading = true;
    }

  }

  ngOnInit(): void {
    setInterval(() => {
        this.getConsommation(); // Appel de la méthode
    }, 60000); // Interval de 60 secondes
  }

  getConsommation(){
    if(this.dateDebut && this.dateFin){

      let dateHeureDebut = this.dateDebut + ' 00:00:0'
      if(this.heureDebut)  { dateHeureDebut = this.dateDebut+' '+this.heureDebut+':0'}
      else { this.el.nativeElement.querySelector('#heureDebut').value = '00:00:00'}

      let dateHeureFin = this.dateFin + ' 00:00:0'
      if(this.heureFin) {dateHeureFin = this.dateFin+' '+this.heureFin+':0'}
      else { this.el.nativeElement.querySelector('#heureFin').value = '00:00:00' }

      this.floorService.getConsommationEquipementParPeriode(dateHeureDebut, dateHeureFin).subscribe(
        (data: any[]) =>{
          this.equipements = data
        })
      
    } else {  // (!this.dateDebut && !this.dateFin)
      let now : Date = new Date() 
      let isoDateString = new Date(now.getTime() + (60 * 60 * 1000)).toISOString();

      this.floorService.getConsommationEquipementParPeriode('2024-01-01 00:00:00', isoDateString.slice(0, 19).replace('T', ' ')).subscribe(
        (data: any[]) =>{
          console.log('dataaa : ', data)
          this.equipements = data
        })
    }
  }

  redirectToEquipementDetails(equipementId: number): void {
    this.router.navigate(['/equipement-details', equipementId]);
  }
}
