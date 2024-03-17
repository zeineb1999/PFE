import { Component, OnInit } from '@angular/core';
import { FloorService } from '../../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
interface Zone {
  
  nomLocal: string;
  typeLocal: string;
  etageZ: number;
}

@Component({
  selector: 'app-ajouter-zone-sans-etage',
  templateUrl: './ajouter-zone-sans-etage.component.html',
  styleUrls: ['./ajouter-zone-sans-etage.component.css']
})
export class AjouterZoneSansEtageComponent implements OnInit {
  zones: Zone[] = [];
  nomLocal?: string;
  typeLocal?: string;
  etageZ?: number;
  etages: any[] = [];

  constructor(private floorService:FloorService,private route: ActivatedRoute, private router: Router) {
    // Code du constructeur
  
   }

  ngOnInit(): void {
    // Chargez les étages depuis votre API Django lors de l'initialisation du composant
   
    this.etageZ = parseInt(this.route.snapshot.paramMap.get('etageId') || '');
  }



  ajouterZone(): void {
    const zoneData: Zone = {
      nomLocal: this.nomLocal || '',
      typeLocal: this.typeLocal || '',
      etageZ: this.etageZ || 1 // Assurez-vous que la valeur par défaut est correcte
    };
  
    // Vérifiez si les valeurs sont définies avant d'appeler le service
    if (zoneData.nomLocal && zoneData.typeLocal && zoneData.etageZ) {
      this.floorService.addZone(zoneData).subscribe(
        (data: Zone) => {
          console.log(data);
          this.zones.push(data);
          
          // Redirection vers la page '/toutesZones' après l'ajout d'une zone
          this.router.navigateByUrl(`/toutesZones`);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      console.log("Veuillez remplir tous les champs.");
    }
  }
}  