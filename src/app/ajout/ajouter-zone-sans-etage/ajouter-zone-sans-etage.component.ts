
import { Component, OnInit } from '@angular/core';
import { FloorService } from '../../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
interface Zone {
  id: number;
  nomLocal: string;
  typeLocal: string;
  surface: number;
  etageZ: number;
}

@Component({
  selector: 'app-ajouter-zone-sans-etage',
  templateUrl: './ajouter-zone-sans-etage.component.html',
  styleUrls: ['./ajouter-zone-sans-etage.component.css']
})
export class AjouterZoneSansEtageComponent implements OnInit {
  zones: Zone[] = [];
  zonesSurface: Zone[] = [];
  etageZ?: number;

  numLocal?: number;
  nomLocal?: string;
  typeLocal?: string;
  etageId: number = 0;
  etages: any[] = [];
  temperature?: number;
  surface?: number;
  hauteur?: number;
  isLoggedIn: boolean;
  totalSurface: number = 0;
  surfaceAlert: boolean = false;

 
  constructor(private floorService:FloorService,private route: ActivatedRoute, private router: Router) {
    // Code du constructeur
     this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
   }

   ngOnInit(): void {
    this.etageZ = parseInt(this.route.snapshot.paramMap.get('etageId') || '');
    this.etageId = parseInt(this.route.snapshot.paramMap.get('etageId') || '');
    this.loadEtages();
    
}
  

  loadEtages(): void {
    // Appelez votre service pour charger les étages depuis l'API Django
    this.floorService.getAllEtages().subscribe((data: any[]) => {
      this.etages = data;
    });
  }
  ajouterZone(): void {
    const zoneData: Zone = {
      id: 0,
      nomLocal: this.nomLocal || '',
      typeLocal: this.typeLocal || '',
      surface: this.surface || 0,
      etageZ: this.etageZ || 0 // Assurez-vous que la valeur par défaut est correcte
    };
    this.loadEtages();
  
    // Vérifiez si les valeurs sont définies avant d'appeler le service
    if (zoneData.nomLocal && zoneData.typeLocal && zoneData.etageZ) {
      // Calculer la somme des surfaces des zones existantes pour l'étage
      const surfaceTotaleEtage = this.etages.find(etage => etage.id === this.etageZ)?.surface || 0;
      console.log(surfaceTotaleEtage);
      console.log(this.etageId);
      this.floorService.getZonesForEtage(this.etageId).subscribe(
        (data: Zone[]) => {
          this.zonesSurface = data;
          let totalSurface = 0; // Initialisez totalSurface à zéro
          for (const zone of this.zonesSurface) {
            totalSurface += zone.surface;
          }
          const surfacesRestantes = surfaceTotaleEtage - totalSurface;
          // Vérifier si la surface de la zone à ajouter est inférieure ou égale au reste de la surface de l'étage
          if (zoneData.surface <= surfacesRestantes) {
            this.floorService.addZone(zoneData).subscribe(
              (data: Zone) => {
                console.log(data);
                const zoneId = data.id;
                this.floorService.genererDATA(zoneId,this.temperature!).subscribe(
                  (response) => {
                    
                  }
              )
                this.zones.push(data);
                // Redirection vers la page '/toutesZones' après l'ajout d'une zone
                this.router.navigateByUrl(`/toutesZones`);
              },
              error => {
                console.log(error);
              }
            );
          } else {
            this.surfaceAlert = true;
      setTimeout(() => {
        this.surfaceAlert = false; // Réinitialisez la variable après une seconde
      }, 1000);
          }
        }
      );
    } else {
      console.log("Veuillez remplir tous les champs.");
    }
  }

  

  goBack() {
    window.history.back();
  }
}
