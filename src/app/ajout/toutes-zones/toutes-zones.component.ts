/* toutes-zones.component.ts

import { Component, OnInit } from '@angular/core';
import { FloorService } from  'src/app/service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-toutes-zones',
  templateUrl: './toutes-zones.component.html',
  styleUrls: ['./toutes-zones.component.css']
})
export class ToutesZonesComponent implements OnInit {
  etages: any[] = [];

  constructor(private floorService:FloorService,private route: ActivatedRoute, private router: Router) {
    // Code du constructeur
  
   }

  ngOnInit(): void {
    this.floorService.getAllEtages().subscribe(etages => {
      this.etages = etages;
    });
  }

  fetchZonesForEtage(etageId: number): void {
    const etage = this.etages.find(e => e.id === etageId);
    if (etage) {
      this.floorService.getZonesForEtage(etageId).subscribe(zones => {
        etage.zones = zones;
        etage.showZones = true;
      });
    }
  }
  redirectToZoneDetails(zoneId: number): void {
    this.router.navigate(['/zone-details', zoneId]);
  }
  
}



/*import { Component, OnInit } from '@angular/core';
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
*/

// toutes-zones.component.ts

import { Component, OnInit } from '@angular/core';
import { FloorService } from  'src/app/service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'; // Importez Location depuis @angular/common


@Component({
  selector: 'app-toutes-zones',
  templateUrl: './toutes-zones.component.html',
  styleUrls: ['./toutes-zones.component.css']
})
export class ToutesZonesComponent implements OnInit {
  etages: any[] = [];

  constructor(private floorService:FloorService,private route: ActivatedRoute, private router: Router,private location: Location) {
    // Code du constructeur

   }

  ngOnInit(): void {
    this.floorService.getAllEtages().subscribe(etages => {
      this.etages = etages;
    });
  }

  fetchZonesForEtage(etageId: number): void {
    const etage = this.etages.find(e => e.id === etageId);
    if (etage) {
      this.floorService.getZonesForEtage(etageId).subscribe(zones => {
        etage.zones = zones;
        etage.showZones = true;
      });
    }
  }

  hideZonesForEtage(etageId: number): void {
    const etage = this.etages.find(e => e.id === etageId);
    if (etage) {
      this.floorService.getZonesForEtage(etageId).subscribe(zones => {
        etage.zones = zones;
        etage.showZones = false;
        console.log("clicked");
      });
    }
  }
  redirectToZoneDetails(zoneId: number): void {
    this.router.navigate(['/zone-details', zoneId]);
  }

  redirectToAjouterZone(etageId: number): void {
    // Redirigez vers le composant d'ajout d'équipement en passant l'ID de la zone dans l'URL
    this.router.navigate(['/ajouterZone', etageId]);
  }

  redirectToZoneEquipemets(zoneId: number): void {
    // Redirigez vers le composant d'ajout d'équipement en passant l'ID de la zone dans l'URL
    this.router.navigate(['/equipements', zoneId]);
  }
 
  deleteZone(zoneId: number): void {
    this.floorService.deleteZone(zoneId).subscribe(() => {
      // Redirigez vers la même page pour rafraîchir
      window.location.reload();
    });
  }
  
  updateEtage(etageId: number): void {
    this.router.navigate(['/updateEtage',etageId]);
  }
  deleteEtage(etageId: number): void {
    this.floorService.deleteEtage(etageId).subscribe(() => {
      // Redirigez vers la même page pour rafraîchir
      window.location.reload();
    });
  }
  
  updateZone(zoneId: number): void {
    this.router.navigate(['/updateZone',zoneId]);
  }

}



/*import { Component, OnInit } from '@angular/core';
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
}*/
