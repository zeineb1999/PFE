import { Component, OnInit } from '@angular/core';
import { FloorService } from '../../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
interface Floor {
  id: number;
  nomEtage: string;
  batimentId: number;
}
@Component({
  selector: 'app-ajouter-etage',
  templateUrl: './ajouter-etage.component.html',
  styleUrls: ['./ajouter-etage.component.css']
})

export class AjouterEtageComponent implements OnInit {
  floorSurface?: number;
  floorName?: string;
  isLoggedIn: boolean;
  batimentId?: number = 0;
  batiment: any;
 
  ngOnInit(): void {
    this.batimentId = parseInt(this.route.snapshot.paramMap.get('batimentId') || '');
    this.floorService.getBatimentById(this.batimentId).subscribe((bat: any) => {
      this.batiment = bat
    })
    
  }
  constructor(private floorService: FloorService,private route: ActivatedRoute, private router: Router) {  this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';}

  ajouterEtage(): void {
    if (this.floorName !== undefined && this.batimentId !== undefined) {
      const etageData = {
        nomEtage: this.floorName,
        batimentId: this.batimentId
      };
  
      this.floorService.addFloor(etageData)
        .subscribe(response => {
          this.router.navigateByUrl(`/toutesZones`);
          // Traitement en cas de succès, par exemple redirection ou actualisation des données
        }, error => {
          // Gérer les erreurs, par exemple afficher un message d'erreur à l'utilisateur
        });
    } else {
      // Gérer le cas où this.floorName est undefined, par exemple afficher un message d'erreur à l'utilisateur
    }
  }

  goBack() {
    window.history.back();
  }
  
}