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
  lastDateActiver!:string;
  zoneDetails: any | undefined;
  equipements: Equipement[] = [];
  equipementsLocals: any[]  = ['rien'];
  selectedEquipement: Equipement | undefined;
  equipementActif: boolean = false;
  isLoggedIn: boolean;
  batiment: string = 'a';
  temperature: any;
  presence:any;
  humidite: any;
  idBatiment:any;
  nomBatiment:any;
  DesactiverZone:boolean=false;
  activerZone:boolean=false;
  idSelectionne:number=0;
  raison:string="";
  data: any[]=[];
  role:any;
  id:any;
  predictionValue: any; 
  selectedReason: string = '';
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
  categories: string[] = ['Equipements médicaux', 'Equipements de bureaux', 'Eclairage', 'Prises à usage personnel', 'Climatiseurs', 'Chauffages', 'Déshumidificateurs']; // Array pour stocker les catégories uniques
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
    markers = {};


    markerConfig = {
    "0": { color: '#555', size: 8, label: '0', type: 'line'},
    "15": { color: '#555', size: 4, type: 'line'},
    "30": { color: '#555', size: 8, label: '30', type: 'line'},
    "40": { color: '#555', size: 4, type: 'line'},
    "50": { color: '#555', size: 8, label: '50', type: 'line'},
    "60": { color: '#555', size: 4, type: 'line'},
    "70": { color: '#555', size: 8, label: '70', type: 'line'},
    "85": { color: '#555', size: 4, type: 'line'},
    "100": { color: '#555', size: 8, label: '100', type: 'line'},
}



  constructor(private route: ActivatedRoute, private router: Router, private floorService: FloorService) {this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; }
formatValue(value: any) {
  if (value.toString().length > 10) {
    return value.toString().substring(0, 10) + "...";
  } else {
    return value;
  }
}
  ngOnInit(): void {
    this.role = sessionStorage.getItem('role');
    this.id= sessionStorage.getItem('id');
    this.zoneId = parseInt(this.route.snapshot.paramMap.get('zoneId') || '');

    this.loadDetails();
    this.fetchNewValues();
    this.floorService.dateDesactivation(this.zoneId).subscribe(
      (batiment: any) => {
       this.lastDateActiver=batiment.date;
      })

    setInterval(() => {
      this.fetchNewValues();
    }, 60000); // 60000 millisecondes = 1 minute


  }
  dateFormate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formate la date selon les paramètres régionaux
  }

  timeFormate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formate l'heure selon les paramètres régionaux
  }
    
    loadDetails(): void {
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
      //console.log('zoooooooooooooooooooooooooone', this.zoneDetails)
      
      /* if (this.zoneDetails) {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        this.floorService.getEquipementsByZone(this.zoneDetails.id).subscribe((data: any[]) => {
            console.log('dtaa: ', data, ' ',  data.length)
            this.equipements = data;
          
            
          },
          (error) => {
            console.log(error);
          }
        );
      } */

    // Récupérer le paramètre zoneId de l'URL
    this.zoneId = parseInt(this.route.snapshot.paramMap.get('zoneId') || '');

    // Appeler le service pour récupérer les détails de la zone
    this.floorService.getZoneDetails(this.zoneId).subscribe(
      (data: any) => {
        this.zoneDetails = data;
        this.markers = {
          [data.minT]: { color: "#555", type: "triangle", size: 8, label: "min", font: "12px arial" },
          [data.maxT]: { color: "#555", type: "triangle", size: 8, label: "max", font: "12px arial" }
        };
        console.log('zone: ', data)
        this.floorService.getEtageById(this.zoneDetails.etageZ).subscribe(
          (etage: any) => {
            this.floorService.getBatimentById(etage.batimentId).subscribe(
              (batiment: any) => {
                console.log( 'batiment - ', batiment)
                this.batiment = batiment;
                this.idBatiment=batiment.id;
                this.nomBatiment=batiment.nomBatiment;
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
            
            data.forEach(equipement => {
              this.floorService.getPeriodeParEquipement(equipement.id, dateFormatee).subscribe((periode: any) => {
                console.log('quipement:', equipement.nom, ' periode: ', periode)
                if (periode.length>0) {
                  equipement.etat = 'ON'
                } else {
                  equipement.etat = 'OFF'
                }
              })
            });
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

  fetchNewValues(): void {
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

    const dateFormatee = `${annee}-${mois}-${jour}T${heures}:${minutes}:${secondes}.${millisecondes}Z`;

    console.log(dateFormatee);

    this.floorService.avg_TH_par_instant(this.zoneId, this.dateFormatter(dateFormatee)).subscribe(
      (response: any) => {
        this.temperature = response.T.toFixed(1);
        this.humidite = response.H.toFixed(1);
        this.presence = response.P;

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
  handleToggleOnZone(batimentId: number): void {
    this.idSelectionne=batimentId;
    this.activerZone=true
        
    }
  confirmerActiverZone(){
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
    console.log(`Toggle is ON for batiment ID: ${this.idSelectionne}`);
    this.floorService.ActiverZone(this.idSelectionne,dateFormatee).subscribe(any => {
     
      this.floorService.HistoriqueZone('activer',this.idSelectionne,dateFormatee,this.id,'').subscribe(any=>{
        
      })
      
      this.activerZone=false;
      this.idSelectionne=0;
      window.location.reload();
    })
  
  }
  
  
  annulerActiverZone(){
    this.activerZone=false;
    this.idSelectionne=0;
  
  }
  handleToggleOffZone(batimentId: number): void {
   
    this.idSelectionne=batimentId;
    this.DesactiverZone=true
  }
  confirmerDesactiverZone(){
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
    console.log(`Toggle is ON for batiment ID: ${this.idSelectionne}`);
    this.floorService.DesactiverZone(this.idSelectionne,dateFormatee).subscribe(any => {
      let reason
      if(this.selectedReason==='Autre'){
        reason= this.raison
      }
      else{
        reason=this.selectedReason
      }
      console.log('raison',reason)
      this.floorService.HistoriqueZone('desactiver',this.idSelectionne,dateFormatee,this.id,reason).subscribe(any=>{
        
      })
      window.location.reload();
      this.DesactiverZone=false;
    })
  
  }
  annulerDesactiverZone(){
    this.DesactiverZone=false;
    this.idSelectionne=0;
  
  }
  
  predire(zoneId: number): void {
    const data = { zoneId: zoneId }; // Emballez zoneId dans un objet
    this.floorService.predictConsumptionLocal(data).subscribe(
      value => {
        this.predictionValue = value.predicted_consumption;
        console.log("la prediciton ",this.predictionValue) // Stocke la valeur retournée
      },
      error => {
        console.error('Erreur lors de la prédiction:', error);
        alert('Erreur lors de la prédiction: ' + JSON.stringify(error)); // Affichez l'erreur pour diagnostic
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
    if (this.equipementsLocals) {
      if (this.typeFiltre === '' && this.categorieFiltre === '' && this.etatFiltre === '') {
          // Si aucun filtre n'est sélectionné, afficher tous les équipements
          this.equipementsFiltre = this.equipementsLocals.slice();
      } else {
        let typeCondition : boolean;
        let categorieCondition: boolean;
        let etatCondition: boolean;
          // Si au moins un filtre est sélectionné, appliquer les filtres
          this.equipementsFiltre = this.equipementsLocals.filter(equipement => {
            // Vérifier si le filtre de type est défini et si l'équipement correspond
            if (equipement.categorie) {
              typeCondition = this.typeFiltre === '' || equipement.categorie.toLocaleLowerCase() === this.typeFiltre.toLocaleLowerCase();
            }
            console.log('equipement.categorie: ', equipement.categorie, ' this.typeFiltre: ', this.typeFiltre, ': ', typeCondition)
            // Vérifier si le filtre de catégorie est défini et si l'équipement correspond
            if (equipement.type) {
              categorieCondition = this.categorieFiltre === '' || equipement.type.toLocaleLowerCase() === this.categorieFiltre.toLocaleLowerCase();
            }
            console.log('equipement.type: ', equipement.type, ' this.categorieFiltre: ', this.categorieFiltre, ' : ', categorieCondition)
  
              // Vérifier si le filtre d'état est défini et si l'équipement correspond
              etatCondition = this.etatFiltre === '' || equipement.etat === this.etatFiltre;
  
            // Retourner true si toutes les conditions sont remplies, sinon false
            console.log('res: ', (typeCondition==undefined || typeCondition==true) && (categorieCondition==undefined || categorieCondition==true) && (etatCondition==undefined || etatCondition==true))
              return (typeCondition==undefined || typeCondition==true) && (categorieCondition==undefined || categorieCondition==true) && (etatCondition==undefined || etatCondition==true)
          });
      }
  
      console.log("Filtre : ", this.equipementsFiltre);
      
    }
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
