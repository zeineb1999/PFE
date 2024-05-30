import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_networkgraph from 'highcharts/modules/networkgraph';
import { FloorService } from '../../service/floor.service';
import { forkJoin, of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import{Subscription} from 'rxjs';

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
};
// Définir un type de batiment
interface BatimentType {
  id: number;
  nom: string;
  etages: EtageType[];
};

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
export class EquipementsList2Component {
  constructor(private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  }

  equipementsFiltre: Equipement[] = []; // Variable pour stocker les equipements filtreés dans equipementsFiltre
  // Array pour stocker les équipements
  categories: string[] = ['Equipements médicaux', 'Equipements de bureaux', 'Eclairage', 'Prises à usage personnel', 'Climatiseurs', 'Chauffages', 'Déshumidificateurs']; // Array pour stocker les catégories uniques
  etats: string[] = ['ON', 'OFF']; // Array pour stocker les états uniques
  types: string[] = ['Critique','normal']; // Array pour stocker les types uniques

  categorieFiltre: string = ''; // Propriété pour stocker la valeur du filtre de catégorie sélectionné
  etatFiltre: string = ''; // Propriété pour stocker la valeur du filtre d'état sélectionné
  typeFiltre: string = ''; // Propriété pour stocker la valeur du filtre de type sélectionné


  isLoggedIn: boolean;
  EquipementsLoading: Boolean = true;
  EquipementAChercher :string|undefined;
  private equipementsSubscription: Subscription | undefined;
  private equipementsSubscription2: Subscription | undefined;
  equipements:  any[]  = ['rien'];
  @Input() dateDebut: string = '';
  @Input() heureDebut: string = '';
  @Input() dateFin: string = '';
  @Input() heureFin: string = '';

  /* ngOnChanges() {
    if(this.equipements){

      if(this.equipements.length == 0) {
        this.EquipementsLoading = true;
      } else {
        this.EquipementsLoading = false;
      }

    } else {
      this.EquipementsLoading = true;
    }

  } */

  ngOnDestroy(): void {
    if (this.equipementsSubscription) {
      this.equipementsSubscription.unsubscribe();
    }
    if (this.equipementsSubscription2) {
      this.equipementsSubscription2.unsubscribe();
    }
  }

  ngOnInit(): void {
    const maDate = new Date();
    const annee = maDate.getUTCFullYear();
    const mois = String(maDate.getUTCMonth() + 1).padStart(2, '0');
    const jour = String(maDate.getUTCDate()).padStart(2, '0');
    let heures=''
    if (maDate.getUTCHours() < 23) {
    heures = String(maDate.getUTCHours()+1).padStart(2, '0');
    } else {
    heures = '00'.padStart(2, '0');
    }

    const minutes = String(maDate.getUTCMinutes()).padStart(2, '0');
    const secondes = String(maDate.getUTCSeconds()).padStart(2, '0');
    const millisecondes = String(maDate.getUTCMilliseconds()).padStart(3, '0');

    const dateFormatee = `${annee}-${mois}-${jour} ${heures}:${minutes}:${secondes}`;
    this.equipementsSubscription = this.floorService.getAllEquipements().subscribe(
      (data: Equipement[]) => {
        this.equipements = data
        this.equipementsFiltre = data
        if (this.equipements.length == data.length) {

          this.equipements.forEach(equipement => {

            this.floorService.getPeriodeParEquipement(equipement.id, dateFormatee).subscribe((periode: any) => {
              //console.log('quipement:', equipement.nom, ' periode: ', periode)
              if (periode.length>0) {
                equipement.etat = 'ON'
              } else {
                equipement.etat = 'OFF'
                //console.log("************************",equipement.etat, 'this.etatFiltre', this.etatFiltre)

              }
              console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM***************", equipement)
            })
          });
        }
    })
    /* setInterval(() => {
      getConsommation()
    }, 60000); // Interval de 60 secondes */
  }

  getConsommation(){
    if(this.dateDebut && this.dateFin){

      let dateHeureDebut = this.dateDebut + ' 00:00:0'
      if(this.heureDebut)  { dateHeureDebut = this.dateDebut+' '+this.heureDebut+':0'}
      else { this.el.nativeElement.querySelector('#heureDebut').value = '00:00:00'}

      let dateHeureFin = this.dateFin + ' 00:00:0'
      if(this.heureFin) {dateHeureFin = this.dateFin+' '+this.heureFin+':0'}
      else { this.el.nativeElement.querySelector('#heureFin').value = '00:00:00' }

      this.equipementsSubscription = this.floorService.getAllEquipements().subscribe(
        (data: any[]) =>{
          this.equipementsFiltre = data
        })

    } else {  // (!this.dateDebut && !this.dateFin)
      let now : Date = new Date()
      let isoDateString = new Date(now.getTime() + (60 * 60 * 1000)).toISOString();

        console.log('peeeriode: ', '2024-'+(new Date().getMonth()+1)+'-01 00:00:00',' -> ', isoDateString.slice(0, 19).replace('T', ' '))
        this.equipementsSubscription2 = this.floorService.getAllEquipements().subscribe(        (data: any[]) =>{
          console.log('dataaa : ', data)
          this.equipementsFiltre = data
        })
    }
  }

  redirectToEquipementDetails(equipementId: number): void {
    this.router.navigate(['/equipement-details', equipementId]);
  }

  filtrerEquipements() {
    console.log('******************************* etaaaaaaaaaaaaaat', this.etatFiltre)
    // Vérifier si aucun filtre n'est sélectionné
    if (this.equipements) {
      if (this.typeFiltre === '' && this.categorieFiltre === '' && this.etatFiltre === '') {
          // Si aucun filtre n'est sélectionné, afficher tous les équipements
          this.equipementsFiltre = this.equipements.slice();
      } else {
        let typeCondition : boolean;
        let categorieCondition: boolean;
        let etatCondition: boolean;
        // Si au moins un filtre est sélectionné, appliquer les filtres
        this.equipements.forEach(element => {
          console.log('pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp ', element.etat)
        });
        this.equipementsFiltre = this.equipements.filter(equipement => {
            console.log("***************", equipement.etat)
            // Vérifier si le filtre de type est défini et si l'équipement correspond
            if (equipement.categorie) {
              typeCondition = this.typeFiltre === '' || equipement.categorie.toLocaleLowerCase() === this.typeFiltre.toLocaleLowerCase();
            }
            //console.log('equipement.categorie: ', equipement.categorie, ' this.typeFiltre: ', this.typeFiltre, ': ', typeCondition)
            // Vérifier si le filtre de catégorie est défini et si l'équipement correspond
            if (equipement.type) {
              categorieCondition = this.categorieFiltre === '' || equipement.type.toLocaleLowerCase() === this.categorieFiltre.toLocaleLowerCase();
            }
            //console.log('equipement.type: ', equipement.type, ' this.categorieFiltre: ', this.categorieFiltre, ' : ', categorieCondition)

              // Vérifier si le filtre d'état est défini et si l'équipement correspond
            etatCondition = this.etatFiltre === '' || equipement.etat.toLocaleLowerCase() === this.etatFiltre.toLocaleLowerCase();

            // Retourner true si toutes les conditions sont remplies, sinon false
            //console.log('res: ', (typeCondition==undefined || typeCondition==true) && (categorieCondition==undefined || categorieCondition==true) && (etatCondition==undefined || etatCondition==true))
              return (typeCondition==undefined || typeCondition==true) && (categorieCondition==undefined || categorieCondition==true) && (etatCondition==undefined || etatCondition==true)
          });
      }

      console.log("Filtre : ", this.equipementsFiltre);

    }
}
}