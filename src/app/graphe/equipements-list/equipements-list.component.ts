import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  selector: 'app-equipements-list',
  templateUrl: './equipements-list.component.html',
  styleUrls: ['./equipements-list.component.css']
})
export class EquipementsListComponent {

    isLoggedIn: boolean;
    equipements: any;
    EquipementsLoading: boolean= false;
    EquipementAChercher :string|undefined;

    dateDebut: string = '';
    heureDebut: string = '';
    dateFin: string = '';
    heureFin: string = '';


    constructor(private floorService: FloorService, private router: Router) {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }

    ngOnInit() {
      this.LoadEquipements()
    }

    ngAfterViewInit() {
    }

    LoadEquipements(){

      this.EquipementsLoading = true;
      console.log(this.EquipementsLoading)
      this.floorService.getTousEquipementsConsommation()
        .subscribe(
          (data: any[]) => {
            this.EquipementsLoading = false;
            this.equipements = data;
            console.log(this.EquipementsLoading)
          });
    }

    redirectToEquipementDetails(equipementId: number): void {
      this.router.navigate(['/equipement-details', equipementId]);
    }

    refresh(){
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      this.floorService.getConsommationEquipementParPeriode(this.dateDebut, this.dateFin).subscribe(
        (data) => {
          data.forEach((e: any) => {
            
            console.log(e.consommation_W);
          });
          // Faites quelque chose avec les données reçues, par exemple les afficher dans votre template
        },
        (error) => {
          console.error(error);
        }
      );

        
    }

}