
import { Component, OnInit } from '@angular/core';
import { FloorService } from 'src/app/service/floor.service';
import { Router } from '@angular/router'; // Importez le service Router

interface Equipement {
  id: number;
  nom?: string;
  marque: string;
  etat: string;
  categorie: string;
  type: string;
  puissance: number;
  maxConsommation: number;
  minConsommation: number;
  zoneId: number;
}
@Component({
  selector: 'app-equipements',
  templateUrl: './equipements.component.html',
  styleUrls: ['./equipements.component.css']
})
export class EquipementsComponent implements OnInit {
  equipements: Equipement[] = [];
  selectedEquipement: any;

  constructor(private floorService: FloorService, private router: Router) { }

  ngOnInit(): void {
    this.floorService.getAllEquipements().subscribe(
      (data) => {
        this.equipements = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  equipementsClicked = (equipement: Equipement) => { // Spécifiez le type de movie comme Movie
    this.floorService.getOneZone(equipement.id).subscribe(
      (data: Equipement) => { // Spécifiez le type de données comme Movie
        console.log(data);
        this.selectedEquipement = data; // Mettez à jour les propriétés du film sélectionné
      },
      error => {
        console.log(error);
      }
    );
  }
  redirectToEquipementDetails(equipementId: number): void {
    this.floorService.getZoneDetails(equipementId).subscribe(
      (details) => {
        // Redirigez vers la page des détails de la zone avec ses équipements
        this.router.navigate(['/equipement-details', equipementId], { state: { zone: details } });
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
