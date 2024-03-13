import { Component, OnInit } from '@angular/core';
import {FloorService } from  '../../service/floor.service';
interface Equipement {
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
interface  Zone {
  id: number;
  nomLocal: string;
}
@Component({
  selector: 'app-ajouter-equipement',
  templateUrl: './ajouter-equipement.component.html',
  styleUrls: ['./ajouter-equipement.component.css'],
  providers: [FloorService]
})
export class AjouterEquipementComponent implements OnInit {
  zones: Zone[] = [];
  equipements: Equipement[] = [];
  selectedEquipements: any;
  selectedZones: any;
  nom!: string;
  marque!: string;
  etat!: string;
  categorie!: string;
  type!: string;
  puissance!: number;
  maxConsommation!: number;
  minConsommation!: number;
  zoneId!: number;



  ngOnInit() {
   
  }  ;
  constructor(private floorService: FloorService) {
    this.getZones();
  }
  getZones = () => {
    this.floorService.getAllZones().subscribe(
      (data: Zone[]) => { // Spécifiez le type de données comme Movie[]
        this.zones = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  ajouterEquipement() {
    const equipementData = {
      nom: this.nom,
      marque: this.marque,
      etat: this.etat,
      categorie: this.categorie,
      type: this.type,
      puissance: this.puissance,
      maxConsommation: this.maxConsommation,
      minConsommation: this.minConsommation,
      zoneE: this.zoneId
    };

    this.floorService.addEquipement(equipementData).subscribe(
    (data: Equipement) => { // Spécifiez le type de données comme Movie
    console.log(data);
    this.equipements.push(data); // Mettez à jour les propriétés du film sélectionné
   
  },
  error => {
    console.log(error);
  }
  );
}

}