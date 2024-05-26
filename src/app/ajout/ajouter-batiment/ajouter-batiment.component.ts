import { Component, OnInit } from '@angular/core';
import { FloorService } from '../../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-ajouter-batiment',
  templateUrl: './ajouter-batiment.component.html',
  styleUrls: ['./ajouter-batiment.component.css']
})
export class AjouterBatimentComponent implements OnInit {
 
  batimentName?: string;
  batimentType?: string;
  isLoggedIn: boolean;

 
  ngOnInit(): void {
      
  }
  constructor(private floorService: FloorService,private route: ActivatedRoute, private router: Router) {  this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';}

  ajouterBatiment(): void {
    if (this.batimentName !== undefined && this.batimentType !== undefined) {
      const etageData = {
        nomBatiment: this.batimentName,
        typeBatiment: this.batimentType
      };
  
      this.floorService.addBatiment(etageData)
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

