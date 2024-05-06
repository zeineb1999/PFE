import { Component, OnInit } from '@angular/core';
import { FloorService } from '../../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

interface Equipement {
  id: number;
  nom: string;

  etat: string;
  categorie: string;

  puissance: number;
  maxConsommation: number;
  minConsommation: number;
  zoneE: number;
}

interface Zone {
  id: number;
  nomLocal: string;
}

@Component({
  selector: 'app-update-equipement',
  templateUrl: './update-equipement.component.html',
  styleUrls: ['./update-equipement.component.css']
})
export class UpdateEquipementComponent implements OnInit {
 
    zones: Zone[] = [];
    equipement: Equipement = {
      id: 0,
      nom: '', // Assurez-vous d'initialiser nom avec une valeur par défaut
    
      etat: '',
      categorie: '',
    
      puissance: 0,
      maxConsommation: 0,
      minConsommation: 0,
      zoneE: 0
    };
    equipementId: number = 0;
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
          this.equipementId = parseInt(params.get('equipementId') || '');
          return this.floorService.getEquipementAModifier(this.equipementId);
        })
      ).subscribe(
        (equipement: Equipement) => {
          this.equipement = equipement;
        },
        error => {
          console.log(error);
        }
      );
  
      this.getZones();
    }
  
    getZones() {
      this.floorService.getAllZones().subscribe(
        (data: Zone[]) => {
          this.zones = data;
        },
        error => {
          console.log(error);
        }
      );
    }
  
    updateEquipement() {
      this.floorService.modifierEquipement(this.equipementId, this.equipement).subscribe(
        () => {
          console.log('Équipement modifié avec succès !');
          this.successMessage = 'Équipement modifié avec succès !'; // Définir le message de succès
          setTimeout(() => {
            this.successMessage = ''; // Effacer le message après quelques secondes
            window.history.back(); // Rediriger vers une autre page après la modification
          }, 1000); // 3000 millisecondes = 3 secondes
        },
        error => {
          console.log('Erreur lors de la modification de l\'équipement :', error);
        }
      );
    }

    retour(){
      window.history.back();
    }

  }