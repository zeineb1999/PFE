import { Component } from '@angular/core';
import { FloorService } from '../../service/floor.service';
@Component({
  selector: 'app-ajouter-etage',
  templateUrl: './ajouter-etage.component.html',
  styleUrls: ['./ajouter-etage.component.css']
})
export class AjouterEtageComponent {
  floorSurface?: number;

  constructor(private floorService: FloorService) { }

  ajouterEtage() {
    if (this.floorSurface) {
      this.floorService.addFloor(this.floorSurface)
        .subscribe(response => {
          // Traitement en cas de succès, par exemple redirection ou actualisation des données
        }, error => {
          // Gérer les erreurs, par exemple afficher un message d'erreur à l'utilisateur
        });
    }
  }
}

