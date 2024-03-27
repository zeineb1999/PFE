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
  eta = [
    {
      nom: "Premier étage",
      locaux: ["Salle de réunion", "Bloc opératoire", "Chambre 1", "Chambre 2"]
    },
    {
      nom: "Deuxième étage",
      locaux: ["Chambre 3", "Bureau médecin", "Bureau professeur", "Toilettes"]
    }
  ];
  demandeSuppressionEtage: boolean = false;
  demandeSuppressionZone: boolean = false;
  etages: any[] = [];
  isLoggedIn: boolean;
  constructor(private floorService:FloorService,private route: ActivatedRoute, private router: Router,private location: Location) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

   }
   generateRandomColor(): string {
    // Génération de trois composants RGB aléatoires
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Retourne la couleur au format RGB
    return `rgb(${r}, ${g}, ${b})`;
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



  updateEtage(etageId: number): void {
    this.router.navigate(['/updateEtage',etageId]);
  }

  // Supprimer étage

  demanderSuppEtage(etageId:number): void{
    this.demandeSuppressionEtage = true;
  }

  annulerSuppressionEtage(etageId:number): void{
    this.demandeSuppressionEtage = false;
  }

  deleteEtage(etageId: number): void {
    this.floorService.deleteEtage(etageId).subscribe(() => {
      // Redirigez vers la même page pour rafraîchir
      window.location.reload();
    });
    this.demandeSuppressionEtage = false;
  }

  // Supprimer zone

  demanderSuppZone(etageId:number): void{
    this.demandeSuppressionZone = true;
  }

  annulerSuppressionZone(etageId:number): void{
    this.demandeSuppressionZone = false;
  }

  deleteZone(zoneId: number): void {
    this.floorService.deleteZone(zoneId).subscribe(() => {
      // Redirigez vers la même page pour rafraîchir
      window.location.reload();
    });
    this.demandeSuppressionZone = false;
  }



  updateZone(zoneId: number): void {
    this.router.navigate(['/updateZone',zoneId]);
  }



}