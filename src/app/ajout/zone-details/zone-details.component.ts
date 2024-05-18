import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FloorService } from 'src/app/service/floor.service';
import { switchMap } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';

interface Zone {
  id: number;
  nomLocal: string;
  typeLocal: string;
  etageZ: number;
}
interface Equipement {
    id: number;
    nom: string;

    etat: string;
    categorie: string;
    type: string;
    puissance: number;

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
  equipementsLocals: Equipement[] = [];
  selectedEquipement: Equipement | undefined;
  equipementActif: boolean = false;
  isLoggedIn: boolean;
  batiment: string = 'a';
  temperature: any;
  humidite: any;
  currentEquipement: Equipement = {
    id: 0,
    nom: '',

    etat: '',
    categorie: '',
    type: '',
    puissance: 0,
    zoneE: 1,
  };
  equipementsFiltre: Equipement[] = []; // Variable pour stocker les equipements filtreés dans equipementsFiltre
  // Array pour stocker les équipements
  categories: string[] = ['CVC','Médical',' Électromenager', 'Éclairage','Autre']; // Array pour stocker les catégories uniques
  etats: string[] = ['ON', 'OFF']; // Array pour stocker les états uniques
  types: string[] = ['Critique','normal']; // Array pour stocker les types uniques

  categorieFiltre: string = ''; // Propriété pour stocker la valeur du filtre de catégorie sélectionné
  etatFiltre: string = ''; // Propriété pour stocker la valeur du filtre d'état sélectionné
  typeFiltre: string = ''; // Propriété pour stocker la valeur du filtre de type sélectionné

  gaugeType: NgxGaugeType = "arch";
  gaugeValue = 28.3;
  gaugeLabel = "Speed";
    gaugeAppendText = "km/hr";
    
  thresholdConfig = {
      '0': {color: 'blue'},
      '18': {color: 'green'},
      '26': {color: 'red'}
  };
    
  thresholdConfigH = {
      '0': {color: 'green'},
      '40': {color: 'red'}
  };

  constructor(private route: ActivatedRoute, private router: Router, private floorService: FloorService) {this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; }

  ngOnInit(): void {
    this.zoneId = parseInt(this.route.snapshot.paramMap.get('zoneId') || '');

    this.loadDetails();
    this.fetchNewValues();


    setInterval(() => {
      this.fetchNewValues();
    }, 60000); // 60000 millisecondes = 1 minute


  }

  fetchNewValues(): void {
    const maDate = new Date();
    const annee = maDate.getUTCFullYear();
    const mois = String(maDate.getUTCMonth() + 1).padStart(2, '0');
    const jour = String(maDate.getUTCDate()).padStart(2, '0');
    const heures = String(maDate.getUTCHours()+1).padStart(2, '0');
    const minutes = String(maDate.getUTCMinutes()).padStart(2, '0');
    const secondes = String(maDate.getUTCSeconds()).padStart(2, '0');
    const millisecondes = String(maDate.getUTCMilliseconds()).padStart(3, '0');

    const dateFormatee = `${annee}-${mois}-${jour}T${heures}:${minutes}:${secondes}.${millisecondes}Z`;

    console.log(dateFormatee);

    this.floorService.avg_TH_par_instant(this.zoneId, this.dateFormatter(dateFormatee)).subscribe(
      (response: any) => {
        this.temperature = response.T.toFixed(1);
        this.humidite = response.H.toFixed(1);

      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données : ', error);
      }
    );
  }

  redirectToAjouterEquipement(): void {
    // Redirigez vers le composant d'ajout d'équipement en passant l'ID de la zone dans l'URL
    this.router.navigate(['/ajouterEquipement', this.zoneId]);
  }
  dateFormatter(dateISO: any){
    // Formater la date selon le format requis
    return dateISO.substring(0, 4) + '-' +
    dateISO.substring(5, 7) + '-' +
    dateISO.substring(8, 10)  + ' ' +
    dateISO.substring(11, 13) + ':' +
    dateISO.substring(14, 16) + ':00';
  }
    loadDetails(): void {
      if (this.zoneDetails) {
        this.floorService.getEquipementsByZone(this.zoneDetails.id).subscribe(
          (data: any[]) => {
            this.equipements = data;
            console.log('dtaa: ', data)
          },
          (error) => {
            console.log(error);
          }
        );
      }

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
        this.floorService.getEquipementsByZone(this.zoneDetails.id).subscribe(
        (data: Equipement[]) => {
          this.equipementsLocals = data;
          this.equipementsFiltre = data;
        },
        (error) => {
          console.error('Une erreur s\'est produite lors du chargement des équipements de la zone :', error);
        }
        );
        
      },

      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des détails de la zone :', error);
      }
    );


  }
 /*  filtrerEquipements() {
    this.equipementsFiltre = [];
    console.log("Filtre Type : ", this.typeFiltre, " - Categorie : ", this.categorieFiltre, " - Etat : ", this.etatFiltre);

    this.equipementsLocals.forEach(equipement => {
      console.log("Filtre Type : ", this.typeFiltre, " - Categorie : ", this.categorieFiltre, " - Etat : ", this.etatFiltre);
      console.log(equipement);

      if(this.typeFiltre == '' && this.categorieFiltre == '' && this.etatFiltre == '') {
        console.log('0 0 0');
      }else
      if(this.typeFiltre != '' && this.categorieFiltre != '' && this.etatFiltre != '') {
        if (equipement.categorie == this.typeFiltre && equipement.type == this.categorieFiltre && equipement.etat == this.etatFiltre) {
          this.equipementsFiltre.push(equipement);
          console.log('1 1 1');
        }
        else {
          console.log("aucun ",equipement);
        }

      }else
      if(this.typeFiltre == '' && this.categorieFiltre != '' && this.etatFiltre != '') {
        if (equipement.type == this.categorieFiltre && equipement.etat == this.etatFiltre) {
          this.equipementsFiltre.push(equipement);
          console.log('0 1 1');
        }
      }else
      if(this.typeFiltre != '' && this.categorieFiltre == '' && this.etatFiltre != '') {
        if (equipement.categorie == this.typeFiltre && equipement.etat == this.etatFiltre) {
          this.equipementsFiltre.push(equipement);
          console.log('1 0 1');
        }

      }else
      if(this.typeFiltre != '' && this.categorieFiltre != '' && this.etatFiltre == '') {
        if (equipement.categorie == this.typeFiltre && equipement.type == this.categorieFiltre) {
          this.equipementsFiltre.push(equipement);
          console.log('1 1 0');
        }
      }else
       if(this.typeFiltre != '' && this.categorieFiltre == '' && this.etatFiltre == '') {
        if (equipement.categorie == this.typeFiltre) {
          this.equipementsFiltre.push(equipement);
          console.log('1 0 0');
        }
      }else
      if(this.typeFiltre == '' && this.categorieFiltre != '' && this.etatFiltre == '') {
        if (equipement.type == this.categorieFiltre) {
          this.equipementsFiltre.push(equipement);
          console.log('0 1 0');
        }
      }else
      if(this.typeFiltre == '' && this.categorieFiltre == '' && this.etatFiltre != '') {
        if (equipement.etat == this.etatFiltre) {
          this.equipementsFiltre.push(equipement);
          console.log('0 0 1');
        }
      }


    });

    console.log("Filtre : ", this.equipementsFiltre);
  } */

  filtrerEquipements() {
    // Vérifier si aucun filtre n'est sélectionné
    if (this.typeFiltre === '' && this.categorieFiltre === '' && this.etatFiltre === '') {
        // Si aucun filtre n'est sélectionné, afficher tous les équipements
        this.equipementsFiltre = this.equipementsLocals.slice();
    } else {
        // Si au moins un filtre est sélectionné, appliquer les filtres
        this.equipementsFiltre = this.equipementsLocals.filter(equipement => {
            // Vérifier si le filtre de type est défini et si l'équipement correspond
            const typeCondition = this.typeFiltre === '' || equipement.categorie === this.typeFiltre;
            // Vérifier si le filtre de catégorie est défini et si l'équipement correspond
            const categorieCondition = this.categorieFiltre === '' || equipement.type === this.categorieFiltre;
            // Vérifier si le filtre d'état est défini et si l'équipement correspond
            const etatCondition = this.etatFiltre === '' || equipement.etat === this.etatFiltre;

            // Retourner true si toutes les conditions sont remplies, sinon false
            return typeCondition && categorieCondition && etatCondition;
        });
    }

    console.log("Filtre : ", this.equipementsFiltre);
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