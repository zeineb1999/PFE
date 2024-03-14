import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FloorService } from 'src/app/service/floor.service';

interface Zone {
  id: number;
  nomLocal: string;
  typeLocal: string;
  etageZ: number;
}
interface Equipement {
    id: number;
    nom: string;
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
  selector: 'app-zone-details',
  templateUrl: './zone-details.component.html',
  styleUrls: ['./zone-details.component.css']
})
export class ZoneDetailsComponent implements OnInit {
  zoneId!: number;
  zoneDetails: Zone | undefined;
  equipements: Equipement[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private floorService: FloorService) { }

  ngOnInit(): void {
    // Récupérer le paramètre zoneId de l'URL
    this.zoneId = parseInt(this.route.snapshot.paramMap.get('zoneId') || '');

    // Appeler le service pour récupérer les détails de la zone
    this.floorService.getZoneDetails(this.zoneId).subscribe(
      (data: Zone) => {
        this.zoneDetails = data;
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des détails de la zone :', error);
      }
    );
    this.floorService.getEquipementsByZone(this.zoneId).subscribe(
      (data: Equipement[]) => {
        this.equipements = data;
      },
      (error) => {
        console.error('Une erreur s\'est produite lors du chargement des équipements de la zone :', error);
      }
    );
  }
  redirectToAjouterEquipement(): void {
    // Redirigez vers le composant d'ajout d'équipement en passant l'ID de la zone dans l'URL
    this.router.navigate(['/ajouterEquipement', this.zoneId]);
  }
}
/*import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FloorService } from 'src/app/service/floor.service';

interface Equipement {
  id: number;
  nom: string;
  // Ajoutez d'autres propriétés d'équipement ici selon vos besoins
}

@Component({
  selector: 'app-zone-details',
  templateUrl: './zone-details.component.html',
  styleUrls: ['./zone-details.component.css']
})
export class ZoneDetailsComponent implements OnInit {
  zoneId!: number;
  zoneDetails: any; // Assurez-vous de définir le type correct pour les détails de la zone
  equipements: Equipement[] = [];

  constructor(private route: ActivatedRoute, private floorService: FloorService) { }

  ngOnInit(): void {
    this.zoneId = this.route.snapshot.params['id']; // Obtenez l'ID de la zone à partir de l'URL
    this.loadZoneDetails();
    this.loadEquipements();
  }

  loadZoneDetails(): void {
    this.floorService.getZoneDetails(this.zoneId).subscribe(
      (data) => {
        this.zoneDetails = data;
      },
      (error) => {
        console.error('Une erreur s\'est produite lors du chargement des détails de la zone :', error);
      }
    );
  }

  loadEquipements(): void {
    this.floorService.getEquipementsByZone(this.zoneId).subscribe(
      (data: Equipement[]) => {
        this.equipements = data;
      },
      (error) => {
        console.error('Une erreur s\'est produite lors du chargement des équipements de la zone :', error);
      }
    );
  }
}
*/