import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FloorService } from 'src/app/service/floor.service';
import { switchMap } from 'rxjs/operators';

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
    zoneE: number;
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
  selectedEquipement: Equipement | undefined;
  equipementActif: boolean = false;
  isLoggedIn: boolean;
  batiment: string = 'a';
  currentEquipement: Equipement = {
    id: 0,
    nom: '',
    marque: '',
    etat: '',
    categorie: '',
    type: '',
    puissance: 0,
    maxConsommation: 0,
    minConsommation: 0,
    zoneE: 1,
  };

  constructor(private route: ActivatedRoute, private router: Router, private floorService: FloorService) {this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; }

  ngOnInit(): void {
    this.loadDetails();

  }

  redirectToAjouterEquipement(): void {
    // Redirigez vers le composant d'ajout d'équipement en passant l'ID de la zone dans l'URL
    this.router.navigate(['/ajouterEquipement', this.zoneId]);
  }

  loadDetails(): void {
    this.floorService.getAllEquipements().subscribe(
      (data: Equipement[]) => {
        this.equipements = data;
      },
      (error) => {
        console.log(error);
      }
    );

    // Récupérer le paramètre zoneId de l'URL
    this.zoneId = parseInt(this.route.snapshot.paramMap.get('zoneId') || '');

    // Appeler le service pour récupérer les détails de la zone
    this.floorService.getZoneDetails(this.zoneId).subscribe(
      (data: Zone) => {
        this.zoneDetails = data;
        this.floorService.getEtageById(this.zoneDetails.etageZ).subscribe(
          (etage: any) => {
            this.floorService.getBatimentById(etage.batimentId).subscribe(
              (batiment: any) => {
                console.log(this.batiment, ' - ', this.batiment)
                this.batiment = batiment.nomBatiment;
              },
              (error) => {
                console.error('Une erreur s\'est produite lors de la récupération des détails de la zone :', error);
              }
            );
          },
          (error) => {
            console.error('Une erreur s\'est produite lors de la récupération des détails de la zone :', error);
          }
        );
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

  


  equipementsClicked(equipement: Equipement): void {
    this.selectedEquipement = equipement;
  }

  redirectToEquipementDetails(equipementId: number): void {
    this.router.navigate(['/equipement-details', equipementId]);
  }

  updateEquipement(equipementId: number): void {
    this.router.navigate(['/updateEquipement', equipementId]);
  }

  deleteEquipement(equipementId: number): void {
    this.floorService.deleteEquipement(equipementId).subscribe(() => {
      // Mettre à jour les données après la suppression
      this.loadDetails();
    });
  }
  toggleEquipement(): void {
    this.equipementActif = !this.equipementActif;

    if (this.equipementActif) {
      // Activer l'équipement
      console.log('Équipement activé');
    } else {
      // Désactiver l'équipement
      console.log('Équipement désactivé');
    }
  }


}
