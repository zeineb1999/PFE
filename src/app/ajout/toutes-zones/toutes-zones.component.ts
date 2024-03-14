import { Component, OnInit } from '@angular/core';
import { FloorService } from 'src/app/service/floor.service';
import { Router } from '@angular/router'; // Importez le service Router

interface  Zone {
  id: number;
  nomLocal: string;
  typeLocal: string;
  etageZ: number;
}
@Component({
  selector: 'app-toutes-zones',
  templateUrl: './toutes-zones.component.html',
  styleUrls: ['./toutes-zones.component.css']
})
export class ToutesZonesComponent implements OnInit {
  zones: Zone[] = [];
  selectedZones: any;
  constructor(private floorService: FloorService, private router: Router) { }

  ngOnInit(): void {
    this.floorService.getAllZones().subscribe(
      (data) => {
        this.zones = data;
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des zones :', error);
      }
    );
  }
  zoneClicked = (zone: Zone) => { // Spécifiez le type de movie comme Movie
    this.floorService.getOneZone(zone.id).subscribe(
      (data: Zone) => { // Spécifiez le type de données comme Movie
        console.log(data);
        this.selectedZones = data; // Mettez à jour les propriétés du film sélectionné
       
      },
      error => {
        console.log(error);
      }
    );
  }
  redirectToZoneDetails(zoneId: number): void {
    this.floorService.getZoneDetails(zoneId).subscribe(
      (zoneDetails) => {
        // Redirigez vers la page des détails de la zone avec ses équipements
        this.router.navigate(['/zone-details', zoneId], { state: { zone: zoneDetails } });
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des détails de la zone :', error);
      }
    );
  }
}
