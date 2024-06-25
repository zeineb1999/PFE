import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, Input, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_networkgraph from 'highcharts/modules/networkgraph';
import { FloorService } from '../../service/floor.service';
import { forkJoin, of, Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

interface Local {
  id: number;
  nomLocal: string;
  typeLocal: string;
  etageZ: number;
  surface: any;
}

interface surfaceData {
  name: string;
  y: any;
}

// Définir un type d'étage
interface EtageType {
  infos: any; // id, nom, surface
  locaux: any[];
}

// Définir un type de batiment
interface BatimentType {
  id: number;
  nom: string;
  etages: EtageType[];
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
  selector: 'app-equipements-list2',
  templateUrl: './equipements-list2.component.html',
  styleUrls: ['./equipements-list2.component.css']
})
export class EquipementsList2Component implements OnInit, OnDestroy {
  constructor(private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  }

  equipementsFiltre: Equipement[] = []; // Variable pour stocker les equipements filtreés dans equipementsFiltre
  categories: string[] = ['Equipements médicaux', 'Equipements de bureaux', 'Eclairage', 'Prises à usage personnel', 'Climatiseurs', 'Chauffages', 'Déshumidificateurs']; // Array pour stocker les catégories uniques
  etats: string[] = ['ON', 'OFF']; // Array pour stocker les états uniques
  types: string[] = ['Critique', 'normal']; // Array pour stocker les types uniques

  categorieFiltre: string = ''; // Propriété pour stocker la valeur du filtre de catégorie sélectionné
  etatFiltre: string = ''; // Propriété pour stocker la valeur du filtre d'état sélectionné
  typeFiltre: string = ''; // Propriété pour stocker la valeur du filtre de type sélectionné

  isLoggedIn: boolean;
  EquipementsLoading: Boolean = true;
  EquipementAChercher: string | undefined;
  private subscriptions: Subscription = new Subscription();
  equipements: any[] = ['rien'];
  @Input() dateDebut: string = '';
  @Input() heureDebut: string = '';
  @Input() dateFin: string = '';
  @Input() heureFin: string = '';

  ngOnInit(): void {
    const maDate = new Date();
    const annee = maDate.getUTCFullYear();
    const mois = String(maDate.getUTCMonth() + 1).padStart(2, '0');
    const jour = String(maDate.getUTCDate()).padStart(2, '0');
    let heures = '';
    if (maDate.getUTCHours() < 23) {
      heures = String(maDate.getUTCHours() + 1).padStart(2, '0');
    } else {
      heures = '00'.padStart(2, '0');
    }

    const minutes = String(maDate.getUTCMinutes()).padStart(2, '0');
    const secondes = String(maDate.getUTCSeconds()).padStart(2, '0');
    const millisecondes = String(maDate.getUTCMilliseconds()).padStart(3, '0');

    const dateFormatee = `${annee}-${mois}-${jour} ${heures}:${minutes}:${secondes}`;

    const equipementsSubscription = this.floorService.getAllEquipements().subscribe(
      (data: Equipement[]) => {
        this.equipements = data;
        this.equipementsFiltre = data;
        if (this.equipements.length == data.length) {
          this.equipements.forEach(equipement => {
            const periodeSubscription = this.floorService.getPeriodeParEquipement(equipement.id, dateFormatee).subscribe((periode: any) => {
              if (periode.length > 0) {
                equipement.etat = 'ON';
              } else {
                equipement.etat = 'OFF';
              }
            });
            this.subscriptions.add(periodeSubscription);
          });
        }
      }
    );
    this.subscriptions.add(equipementsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getConsommation() {
    if (this.dateDebut && this.dateFin) {
      let dateHeureDebut = this.dateDebut + ' 00:00:0';
      if (this.heureDebut) {
        dateHeureDebut = this.dateDebut + ' ' + this.heureDebut + ':0';
      } else {
        this.el.nativeElement.querySelector('#heureDebut').value = '00:00:00';
      }

      let dateHeureFin = this.dateFin + ' 00:00:0';
      if (this.heureFin) {
        dateHeureFin = this.dateFin + ' ' + this.heureFin + ':0';
      } else {
        this.el.nativeElement.querySelector('#heureFin').value = '00:00:00';
      }

      const consommationSubscription = this.floorService.getAllEquipements().subscribe(
        (data: any[]) => {
          this.equipementsFiltre = data;
        }
      );
      this.subscriptions.add(consommationSubscription);
    } else {
      let now: Date = new Date();
      let isoDateString = new Date(now.getTime() + (60 * 60 * 1000)).toISOString();

      const consommationSubscription2 = this.floorService.getAllEquipements().subscribe(
        (data: any[]) => {
          this.equipementsFiltre = data;
        }
      );
      this.subscriptions.add(consommationSubscription2);
    }
  }

  redirectToEquipementDetails(equipementId: number): void {
    this.router.navigate(['/equipement-details', equipementId]);
  }

  filtrerEquipements() {
    if (this.equipements) {
      if (this.typeFiltre === '' && this.categorieFiltre === '' && this.etatFiltre === '') {
        this.equipementsFiltre = this.equipements.slice();
      } else {
        let typeCondition: boolean;
        let categorieCondition: boolean;
        let etatCondition: boolean;

        this.equipementsFiltre = this.equipements.filter(equipement => {
          if (equipement.categorie) {
            typeCondition = this.typeFiltre === '' || equipement.categorie.toLocaleLowerCase() === this.typeFiltre.toLocaleLowerCase();
          }
          if (equipement.type) {
            categorieCondition = this.categorieFiltre === '' || equipement.type.toLocaleLowerCase() === this.categorieFiltre.toLocaleLowerCase();
          }
          etatCondition = this.etatFiltre === '' || equipement.etat.toLocaleLowerCase() === this.etatFiltre.toLocaleLowerCase();

          return (typeCondition == undefined || typeCondition == true) &&
                 (categorieCondition == undefined || categorieCondition == true) &&
                 (etatCondition == undefined || etatCondition == true);
        });
      }
    }
  }
}
