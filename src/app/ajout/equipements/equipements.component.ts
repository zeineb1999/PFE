import { Component, OnInit } from '@angular/core';
import { FloorService } from 'src/app/service/floor.service';
import { Router } from '@angular/router';

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

@Component({
  selector: 'app-equipements',
  templateUrl: './equipements.component.html',
  styleUrls: ['./equipements.component.css']
})
export class EquipementsComponent implements OnInit {
  equipements: Equipement[] = [];
  selectedEquipement: Equipement | undefined;
  isLoggedIn: boolean;

  constructor(private floorService: FloorService, private router: Router) {   this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';}

  ngOnInit(): void {
    this.loadEquipements();
  }

  loadEquipements(): void {
    this.floorService.getAllEquipements().subscribe(
      (data: Equipement[]) => {
        this.equipements = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  equipementsClicked(equipement: Equipement): void {
    this.selectedEquipement = equipement;
  }

  redirectToEquipementDetails(equipementId: number): void {
    this.router.navigate(['/equipement-details', equipementId]);
  }

  deleteEquipement(equipementId: number): void {
    this.floorService.deleteEquipement(equipementId).subscribe(() => {
      // Mettre à jour les données après la suppression
      this.loadEquipements();
    });
  }
  updateEquipement(equipementId: number): void {
    this.router.navigate(['/updateEquipement', equipementId]);
  }
}
