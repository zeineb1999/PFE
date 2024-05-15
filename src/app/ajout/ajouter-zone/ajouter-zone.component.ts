import { Component, OnInit } from '@angular/core';
import { FloorService } from '../../service/floor.service';

import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-ajouter-zone',
  templateUrl: './ajouter-zone.component.html',
  styleUrls: ['./ajouter-zone.component.css']
})
export class AjouterZoneComponent implements OnInit {
  nomLocal?: string;
  typeLocal?: string;
  etageId?: number;
  minTemperature?: number;
  etages: any[] = [];
  isLoggedIn: boolean;
  
  constructor(private floorService:FloorService,private route: ActivatedRoute, private router: Router) {
   this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  
   }

  ngOnInit(): void {
    // Chargez les étages depuis votre API Django lors de l'initialisation du composant
    this.loadEtages();
  }

  loadEtages(): void {
    // Appelez votre service pour charger les étages depuis l'API Django
    this.floorService.getAllEtages().subscribe((data: any[]) => {
      this.etages = data;
    });
  }

  ajouterZone(): void {
    // Vérifiez si les valeurs sont définies avant de les passer à votre service
    if (this.nomLocal && this.typeLocal && this.etageId && this.minTemperature) {
        // Appelez votre service pour ajouter une zone en utilisant les données du formulaire
        this.floorService.ajouterZone(this.nomLocal, this.typeLocal, this.etageId).subscribe(
            (response) => {
                console.log('Zone ajoutée avec succès !');
                const zoneId = response.id;
                console.log('ID de la zone ajoutée :', zoneId);
                this.floorService.genererDATA(zoneId,this.minTemperature!).subscribe(
                    (response) => {
                      
                    }
                )
                // Réinitialisez les valeurs des champs après l'ajout de la zone si nécessaire
                this.nomLocal = '';
                this.typeLocal = '';
                this.etageId = 1;
                this.router.navigateByUrl('/toutesZones');
            },
            (error) => {
                console.error('Erreur lors de l\'ajout de la zone :', error);
            }
        );
    } else {
        console.error('Veuillez remplir tous les champs du formulaire.');
    }
  }
}
