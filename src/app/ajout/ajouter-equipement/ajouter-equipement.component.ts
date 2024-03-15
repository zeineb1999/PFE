/*import { Component, OnInit } from '@angular/core';
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
*/
import { Component, OnInit } from '@angular/core';
import { FloorService } from '../../service/floor.service';
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

interface Zone {
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

  zoneRoomId!: any;

  constructor(
    private floorService: FloorService,
    private router: Router, // Injecter Router
    private route: ActivatedRoute
  ) {
    this.getZones();
  }

  ngOnInit() {
    this.zoneRoomId = parseInt(this.route.snapshot.paramMap.get('zoneId') || '');
  }

  getZones = () => {
    this.floorService.getAllZones().subscribe(
      (data: Zone[]) => {
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
      etat: 'OFF', // Vous aviez initialement 'OFF', j'ai conservé cela
      categorie: this.categorie,
      type: this.type,
      puissance: this.puissance,
      maxConsommation: this.maxConsommation,
      minConsommation: this.minConsommation,
      zoneE: this.zoneRoomId
    };

    this.floorService.addEquipement(equipementData).subscribe(
      (data: Equipement) => {
        console.log(data);
        this.equipements.push(data);
        
        // Redirection vers la page '/equipements' après l'ajout d'un équipement
        this.router.navigateByUrl(`/zone-details/${this.zoneRoomId}`);


      },
      error => {
        console.log(error);
      }
    );
  }
}
