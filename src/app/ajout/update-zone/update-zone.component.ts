import { Component, OnInit } from '@angular/core';
import { FloorService } from '../../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';


interface Zone {
  id: number;
  nomLocal: string;
  typeLocal: string;
  surface:number;
  etageZ: number;
}
interface Etage {
  id:number;
  surface: number;
}
@Component({
  selector: 'app-update-zone',
  templateUrl: './update-zone.component.html',
  styleUrls: ['./update-zone.component.css']
})
export class UpdateZoneComponent  implements OnInit {
 
    etages: Etage[] = [];
    zone: Zone = {
      id: 0,
      nomLocal: '', // Assurez-vous d'initialiser nom avec une valeur par défaut
      typeLocal: '',
      surface: 0,
     
      etageZ: 0
    };
    zoneId: number = 0;
    successMessage: string = ''; // Variable pour stocker le message de succès
  
    isLoggedIn: boolean;
  
    constructor(
      private floorService: FloorService,
      private router: Router,
      private route: ActivatedRoute
    ) {this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';}
  
    ngOnInit() {
      this.route.paramMap.pipe(
        switchMap(params => {
          this.zoneId = parseInt(params.get('zoneId') || '');
          return this.floorService.getZoneAModifier(this.zoneId);
        })
      ).subscribe(
        (zone: Zone) => {
          this.zone = zone;
        },
        error => {
          console.log(error);
        }
      );
  
      this.getEtages();
    }
  
    getEtages() {
      this.floorService.getAllEtages().subscribe(
        (data: Etage[]) => {
          this.etages = data;
        },
        error => {
          console.log(error);
        }
      );
    }
  
    updateZone() {
      this.floorService.modifierZone(this.zoneId, this.zone).subscribe(
        () => {
          console.log('Équipement modifié avec succès !');
          this.successMessage = 'Équipement modifié avec succès !'; // Définir le message de succès
          setTimeout(() => {
            this.successMessage = ''; // Effacer le message après quelques secondes
            this.router.navigate(['/toutesZones']); // Rediriger vers une autre page après la modification
          }, 1000); // 3000 millisecondes = 3 secondes
        },
        error => {
          console.log('Erreur lors de la modification de l\'équipement :', error);
        }
      );
    }
  }
  