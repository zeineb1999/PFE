
import { Component, OnInit } from '@angular/core';
import { FloorService } from '../../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';



interface Etage {
  id:number;
  surface: number;
}

@Component({
  selector: 'app-update-etage',
  templateUrl: './update-etage.component.html',
  styleUrls: ['./update-etage.component.css']
})
export class UpdateEtageComponent  {
  isLoggedIn: boolean;
 
    etages: Etage[] = [];
    etage: Etage = {
      id: 0,
      surface: 0
    };
    constructor(
      
    ){
       this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }
}
/*

import { Component, OnInit } from '@angular/core';
import { FloorService } from '../../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';



interface Etage {
  id:number;
  surface: number;
}

@Component({
  selector: 'app-update-etage',
  templateUrl: './update-etage.component.html',
  styleUrls: ['./update-etage.component.css']
})
export class UpdateEtageComponent  implements OnInit {
 
    etages: Etage[] = [];
    etage: Etage = {
      id: 0,
      surface: 0
    };
   
    etageId: number = 0;
    successMessage: string = ''; // Variable pour stocker le message de succès
  
  
    constructor(
      private floorService: FloorService,
      private router: Router,
      private route: ActivatedRoute
    ) {}
  
    ngOnInit() {
      this.route.paramMap.pipe(
        switchMap(params => {
          this.etageId = parseInt(params.get('etageId') || '');
          return this.floorService.getEtageAModifier(this.etageId);
        })
      ).subscribe(
        (etage: Etage) => {
          this.etage = etage;
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
  */