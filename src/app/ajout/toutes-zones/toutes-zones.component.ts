
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
  isLoggedIn: boolean;
  constructor(private floorService:FloorService,private route: ActivatedRoute, private router: Router,private location: Location) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

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


