

import { Component, OnInit } from '@angular/core';
import {FloorService } from  '../../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-ajout-equipement-sans-zone',
  templateUrl: './ajout-equipement-sans-zone.component.html',
  styleUrls: ['./ajout-equipement-sans-zone.component.css']
})
export class AjoutEquipementSansZoneComponent implements OnInit {
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
  isLoggedIn: boolean;
  


  ngOnInit() {
   
  }  ;
  constructor(private floorService: FloorService, private router: Router, // Injecter Router
  private route: ActivatedRoute) {this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
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
      etat: 'OFF',
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
    this.router.navigateByUrl('/equipements');
  },
  error => {
    console.log(error);
  }
  );
}

}