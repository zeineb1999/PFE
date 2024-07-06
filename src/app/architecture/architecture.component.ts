import { Component, OnInit , AfterViewInit} from '@angular/core';
import { FloorService } from  'src/app/service/floor.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'; // Importez Location depuis @angular/common
import { Router } from '@angular/router';
@Component({
  selector: 'app-architecture',
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.css']
})
export class ArchitectureComponent  implements OnInit {

  categoriesLocaux: string[] = ['Cardiologie', 'Neurologie', 'Oncologie', 'Imagerie Médicale', 'Gynécologie et Obstétrique', 'Pédiatrie','Pharmacie','Laboratoires','Services d\'Urgence','Rééducation et Physiothérapie','Restauration','Autre'];
  categoriesLocauxParIndex: string[][] = [];


  // Initialisez la liste des catégories pour chaque index


  categoriesAvecTypesLocaux : { [categorie: string]: string[] } = {
    'Cardiologie': [
      'Salles de Consultation de Cardiologie',
      'Salle de Tests Cardiaques',
      'Autre'
    ],
    'Neurologie': [
      'Salles de Consultation de Neurologie',
      'Salle d\'Électroencéphalographie (EEG)',
      'Salle de Scanner Cérébral',
      'Autre'
    ],
    'Oncologie': [
      'Salles de Consultation d\'Oncologie',
      'Unité de Chimiothérapie',
      'Salles de Traitement pour la Radiothérapie',
      'Autre'
    ],
    'Imagerie Médicale': [
      'Salles de Radiographie',
      'Salles d\'Échographie',
      'Salle de Scanner (TDM)',
      'Salle d\'IRM',
      'Autre'
    ],
    'Gynécologie et Obstétrique': [
      'Salles de Consultation de Gynécologie',
      'Salles de Préparation à l\'Accouchement',
      'Autre'
    ],
    'Pédiatrie': [
      'Salles de Consultation Pédiatrique',
      'Chambres Pédiatriques pour l\'Hospitalisation',
      'Salle de Jeux pour les Enfants',
      'Unité de soins pédiatriques d’urgences',
      'Autre'
    ],
    'Pharmacie': [
      'Zones de Stockage pour les Médicaments',
      'Salle de Préparation des Médicaments',
      'Bureau des Pharmaciens',
      'Zone de Distribution des Médicaments',
      'Autre'
    ],
    'Laboratoires': [
      'Laboratoire d\'Hématologie',
      'Laboratoire de Biochimie',
      'Laboratoire de Microbiologie',
      'Laboratoire d\'Immunologie',
      'Autre'
    ],
    'Services d\'Urgence': [
      'Accueil',
      'Salle d’attente',
      'Zone de soins d’urgences mineurs',
      'Salle de radiologie d’urgences',
      'Zone de traumatologie',
      'Unité de soins intensifs d’urgence',
      'Salle de réveils post-opératoires',
      'Zone de chirurgies d’urgence (Chirurgie Traumatologique et Polyvalente)',
      'Unité de soins de longue durée d’urgence',
      'Autre'
    ],
    'Rééducation et Physiothérapie': [
      'Salles de Physiothérapie',
      'Salle de Kinésithérapie',
      'Salle de Balnéothérapie',
      'Salles d\'Exercices Thérapeutiques',
      'Autre'
    ],
    'Restauration': [
      'Cuisine principale',
      'Zone de préparation des aliments',
      'Stockage des denrées alimentaires',
      'Salle de lavage de la vaisselle',
      'Bureau du responsable de la restauration',
      'Salle de préparation des desserts',
      'Salle de préparation des plats spéciaux',
      'Zone de conditionnement',
      'Salle de contrôle qualité',
      'Salle de réunion pour le personnel de restauration',
      'Autre'
    ]
  };

  categoriesEquipements: string[] = ['CVC','Équipements Médicaux', 'Équipements de Laboratoire', 'Équipements de Bureau', 'Équipements de Restauration', 'Équipements de Soins', 'Équipements de Radiologie', 'Équipements de Physiothérapie', 'Équipements de Chirurgie', 'Équipements de Surveillance', 'Autre'];

  categoriesAvecTypesEquipements: { [categorie: string]: string[] } = {
    CVC: [
      'Ventilateur',
      'Climatiseur',
      'Chauffage',
      'Humidificateur'

    ],
    'Équipements Médicaux': [
      'Électrocardiographe (ECG)',
      'Stéthoscopes',
      'Otoscope et Ophtalmoscope',
      'Tensiomètres',
      'Oxymètres de Pouls',
      'Moniteurs de Surveillance',
      'Défibrillateurs',
      'Échographes',
      'Scanner Cérébral',
      'IRM',
      // Ajoutez d'autres équipements médicaux ici
    ],
    'Équipements de Laboratoire': [
      'Microscopes',
      'Centrifugeuses',
      'Incubateurs',
      'Agitateurs Magnétiques',
      'Thermocycleurs (PCR)',
      'Analyseurs Automatiques',
      'Autoclaves',
      // Ajoutez d'autres équipements de laboratoire ici
    ],
    'Équipements de Bureau': [
      'Ordinateurs',
      'Imprimantes',
      'Scanners',
      'Écrans d\'Affichage',
      'Téléphones',
      // Ajoutez d'autres équipements de bureau ici
    ],
    'Équipements de Restauration': [
      'Cuisinières',
      'Fours',
      'Grills',
      'Réfrigérateurs',
      'Congélateurs',
      'Lave-vaisselle',
      'Robots culinaires',
      'Batteurs électriques',
      // Ajoutez d'autres équipements de restauration ici
    ],
    'Équipements de Soins': [
      'Lits Médicaux',
      'Fauteuils Roulants',
      'Déambulateurs',
      'Aides à la Mobilité',
      'Dispositifs de Soutien',
      // Ajoutez d'autres équipements de soins ici
    ],
    'Équipements de Radiologie': [
      'Appareils de Radiographie',
      'Échographes',
      'Scanners (TDM)',
      'IRM',
      'Équipements de Mammographie',
      // Ajoutez d'autres équipements de radiologie ici
    ],
    'Équipements de Physiothérapie': [
      'Tables de Massage',
      'Appareils de Rééducation',
      'Appareils de Stimulation',
      'Appareils de Traction',
      'Appareils de Cryothérapie',
      // Ajoutez d'autres équipements de physiothérapie ici
    ],
    'Équipements de Chirurgie': [
      'Tables d\'Opération',
      'Luminaires Chirurgicaux',
      'Électrochirurgie',
      'Couteaux Électriques',
      'Pinces Chirurgicales Électriques',
      // Ajoutez d'autres équipements de chirurgie ici
    ],
    'Équipements de Surveillance': [
      'Caméras de Surveillance',
      'Systèmes d\'Alarme',
      'Moniteurs de Surveillance',
      'Systèmes d\'Extraction d\'Air',
      // Ajoutez d'autres équipements de surveillance ici
    ],
    'Autre': [
      'Équipements Divers',
      'Autres Équipements',
      // Ajoutez d'autres équipements divers ici
    ]
  };

  reinitialiserCategories() {
    this.categoriesLocaux = ['Cardiologie', 'Neurologie', 'Oncologie', 'Imagerie Médicale', 'Gynécologie et Obstétrique', 'Pédiatrie','Pharmacie','Laboratoires','Services d\'Urgence','Rééducation et Physiothérapie','Restauration','Autre'];
  }


  categorieSelectionnee: string[] = [];
  typeLocalSelectionne: string[] = [];
  typesBatimentsSelectionne:string[] = [];
  typeEquipementSelectionne: string[] = [];
  categorieChange(index: number) {

      this.typeLocalSelectionne[index] = '';
    //if (this.categoriesLocaux[index] != 'Autre') {
       // this.categoriesLocaux=  ['Cardiologie', 'Neurologie', 'Oncologie', 'Imagerie Médicale', 'Gynécologie et Obstétrique', 'Pédiatrie','Pharmacie','Laboratoires','Services d\'Urgence','Rééducation et Physiothérapie','Restauration','Autre'];
  //}

  }
  categorieChangeBatiment(index: number) {

    this.typesBatimentsSelectionne[index] = '';
  //if (this.categoriesLocaux[index] != 'Autre') {
     // this.categoriesLocaux=  ['Cardiologie', 'Neurologie', 'Oncologie', 'Imagerie Médicale', 'Gynécologie et Obstétrique', 'Pédiatrie','Pharmacie','Laboratoires','Services d\'Urgence','Rééducation et Physiothérapie','Restauration','Autre'];
//}

}
  categorieChangeEquipement(index: number) {
    // Réinitialisez le type de local sélectionné pour cette zone

     this.typeEquipementSelectionne[index] = '';
     if (this.categoriesEquipements[index] != 'Autre') {
     this.categoriesEquipements=  ['CVC','Équipements Médicaux', 'Équipements de Laboratoire', 'Équipements de Bureau', 'Équipements de Restauration', 'Équipements de Soins', 'Équipements de Radiologie', 'Équipements de Physiothérapie', 'Équipements de Chirurgie', 'Équipements de Surveillance', 'Autre'];
   }
  }

  categories: string[] = ['Stockage', 'Impression', 'Réfrigération', 'Éclairage', 'Informatique', 'Autre'];

equipementsParCategorie: { [categorie: string]: string[] } = {
  'Stockage': ['Armoires de stockage', 'Congélateur', 'Réfrigérateur'],
  'Impression': ['Imprimante', 'Étiqueteuse'],
  'Réfrigération': ['Réfrigérateur', 'Congélateur'],
  'Éclairage': ['Éclairage intérieur', 'Éclairage de stockage', 'Éclairage de laboratoire'],
  'Informatique': ['Ordinateur', 'Scanner de code-barres'],
  'Autre': ['Climatisation', 'Chauffage', 'Autre équipement']
};

getCategorieTypesPairs(): { categorie: string, types: string[] }[] {
  return Object.keys(this.categoriesAvecTypesLocaux).map(categorie => ({
    categorie: categorie,
    types: this.categoriesAvecTypesLocaux[categorie]
  }));
}

  equipementSelectionne: string = ''; // Équipement sélectionné
  nouveauEquipement: string = ''; // Nouvel équipement ajouté par l'utilisateur
  autreEquipement: string = '';


  boutonsAjouterEnfonce: boolean[] = [];
  boutonsAjouterEtageEnfonce: boolean[] = [];
  boutonsAjouterLocalEnfonce: boolean[] = [];
  boutonsAjouterEquipementEnfonce: boolean[] = [];
  ajoutTermine: boolean = false;
  nombreBatiments: number = 1;
  tousLesBatiments: any[] = [];
  tousLesNomsBatiments: any[] = [];
  tousLesTypesBatiments:  any[] = [];
  tousLesTypesEtages:any[] = [];
  tousLesNomsEtages: any[]=[];
  tousLesNomsLocaux: any[]=[];
  tousLesNomsEquipements: any[]=[];
  tousLesEtages: any[]=[];
  tousLesZones: any[]=[];
  tousLesEquipements:any[]=[];
  tousLesEtagesSansException:any[]=[];
  tousLesNomsEtagesSansException:any[]=[];
  tousLesZonesSansException:any[]=[];
  tousLesNomsZonesSansException:any[]=[];
  tousLesEquipementsSansException:any[]=[];
  tousLesNomsEquipementsSansException:any[]=[];
  nomsBatiments: string[] = [];
  typesBatiments: string[] = [];
  indiceEtageCourant: number = 0;
  indiceZoneCourant: number = 0;
  indiceEtage2Courant: number = 0;
  indiceEtage3Courant: number = 0;
  indiceEquipementCourant: number=0;
  nomsEtages: string[] = [];
  nomsEquipements:string[]=[];
  nomsZones: string[] = [];
  typeBatiment: string[]=[];
  nombreEtages: number = 1;
  nombreEquipements: number = 0;
  nombreZones: number = 1;
  champsTitle:string[]=["Combiens de batiments voulez-vous insérer ?"]
  champsTitleValue:Record<string,string>={}

  champsClient:string[]=["Nombre d'etages"]
  champsClientValue:Record<string,string>={}
  newChamp:string=""
  factureNumber:number=0

  champsFacture:string[]=[

    ]
  champsClientValueFacture:Record<string,string>={}
  newChampFacture:string=""
  typeItem:Record<string,string>={}
  indiceBatimentCourant: number = 0;
  width:string="w-2"
  color:string[]=["text-blue-600","","",""]
  step:number=0

  Total:number = 0
  NetPayer:number = 0
  // for autoComplete
  keyword = 'name';
  data:any[] = [];
  USERS:any[]=[]


  constructor( private router: Router,
    private floorService: FloorService,

  ) { }

  ngOnInit(): void {
    //console.log("Contenu de tousLesBatiments :", this.tousLesBatiments);
    this.titleInit()

    this.champsClient.forEach((champ)=>{
      this.champsClientValue[champ]=""
    })

    this.champsFacture.forEach((champ)=>{
      this.champsClientValueFacture[champ]='0'
      this.typeItem[champ]="D"
    })

    this.getClients();

  }

  ajouterNewEtage(nomBatiment: string,typeBatiment: string,id:number,index:number) {
    //this.tousLesEtagesSansException.push(nomBatiment);

    this.floorService.ajouterEtage(nomBatiment, id).subscribe(
      (response) => {
        const etageId = response.id;
        //console.log('ID de l\'étage ajouté :', etageId);
        this.tousLesEtagesSansException.push(response.id);
        this.tousLesNomsEtagesSansException.push(nomBatiment);
        this.tousLesNomsEtages.push(nomBatiment);
        this.tousLesTypesEtages.push(typeBatiment);
        //console.log('Étage ajouté avec succès :', response);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'étage :', error);
      }
    );
    this.indiceEtageCourant++; // Incrémente l'index pour passer au bâtiment suivant
    if (this.indiceEtageCourant === this.nombreEtages) {
      // Tous les étages ont été ajoutés pour ce bâtiment, mettez à jour la variable ajoutTermine
      this.ajoutTermine = true;
    }
    this.boutonsAjouterEtageEnfonce[index] = true;

}
  idBatiment:number=0;
  prochainBatiment(nomBatiment: string) {
    //console.log('nb: ', this.nombreBatiments, 'indiceBatimentCourant ', this.indiceBatimentCourant, '->', this.indiceBatimentCourant+1)
    this.indiceBatimentCourant++;
    // Réinitialisez l'indice de l'étage courant pour le nouveau bâtiment
    this.indiceEtageCourant = 0;
    this.tousLesEtages = [];
    this.nomsEtages = [];
    this.boutonsAjouterEtageEnfonce = [];
  }
  ajouterNewEquipement(nomBatiment: string,id:number, index:number) {
    //this.tousLesZonesSansException.push(nomBatiment);
    this.floorService.ajouterEquipementArchi(nomBatiment, id).subscribe(
      (response) => {
        const equipementId = response.id;
        //console.log('ID de l equipement ajoutée :', equipementId);
        this.tousLesEquipementsSansException.push(response.id);
        this.tousLesNomsEquipementsSansException.push(nomBatiment);
        this.tousLesNomsEquipements.push(nomBatiment);
        //console.log('Étage ajouté avec succès :', response);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'étage :', error);
      }
    );

    this.indiceEquipementCourant++; // Incrémente l'index pour passer au bâtiment suivant
    this.boutonsAjouterEquipementEnfonce[index] = true;
  }
  prochainEquipement(nomBatiment: string){
     // Récupérer l'ID du bâtiment

        // Mettre à jour l'indice du bâtiment courant
        this.indiceEtage3Courant++;
        // Réinitialisez l'indice de l'étage courant pour le nouveau bâtiment
        this.indiceEquipementCourant = 0;
        this.tousLesEquipements=[];
  }
  idEtage:number=0;
  ajouterNewZone(nomBatiment: string,id:number,index:number) {
    //this.tousLesZonesSansException.push(nomBatiment);
    /* this.floorService.ajouterZoneArchi(nomBatiment, id).subscribe(
      (response) => {
        const zoneId = response.id;
        //console.log('ID de la zone ajoutée :', zoneId);
        this.tousLesZonesSansException.push(response.id);
        this.tousLesNomsZonesSansException.push(nomBatiment);
        this.tousLesNomsLocaux.push(nomBatiment);
        //console.log('Étage ajouté avec succès :', response);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'étage :', error);
      }
    ); */

    this.indiceZoneCourant++; // Incrémente l'index pour passer au bâtiment suivant
    this.boutonsAjouterLocalEnfonce[index] = true;
  }
  prochainEtage(nomBatiment: string) {
    // Récupérer l'ID du bâtiment

        // Mettre à jour l'indice du bâtiment courant
        this.indiceEtage2Courant++;
        // Réinitialisez l'indice de l'étage courant pour le nouveau bâtiment
        this.indiceZoneCourant = 0;
        this.tousLesZones=[];

  }



  updateBuildingName(newName: string, index: number) {
    this.nomsBatiments[index] = newName;
  }






  addChamp(): void {
    this.champsClient.push(this.newChamp)
    this.champsClientValue[this.newChamp]=""
    this.newChamp=""
  }

  generateBuildingNames() {
    this.nomsBatiments = [];
    for (let i = 0; i < this.nombreBatiments; i++) {
      this.nomsBatiments.push('');
    }
    this.boutonsAjouterEnfonce = new Array(this.nombreBatiments).fill(false);
    this.boutonsAjouterEtageEnfonce = Array(this.nombreEtages).fill(false);
    this.boutonsAjouterLocalEnfonce = Array(this.nombreZones).fill(false);
    this.boutonsAjouterEquipementEnfonce = Array(this.nombreEquipements).fill(false);
  }
  ajouterNew(nomBatiment: string,typeBatiment:string,index:number) {
    this.floorService.ajouterBatiment(nomBatiment,typeBatiment).subscribe(
      (response) => {
        const batimentId = response.id;
        //console.log('ID du batiment ajouté :', batimentId);
        this.tousLesBatiments.push(batimentId);

        this.tousLesNomsBatiments.push(nomBatiment);
        //console.log(' nom  Bâtiment  :', nomBatiment);
        this.tousLesTypesBatiments.push(typeBatiment);
        //console.log('type Bâtiment  :', typeBatiment);
          // Vous pouvez effectuer des actions supplémentaires ici si nécessaire
      },
      (error) => {
          console.error('Erreur lors de l\'ajout du bâtiment :', error);
          // Vous pouvez gérer l'erreur ici si nécessaire
      }
  );
    this.indiceBatimentCourant++; // Incrémente l'index pour passer au bâtiment suivant
    this.boutonsAjouterEnfonce[index] = true;
}

  saveAndAddBuildings() {

   this.indiceBatimentCourant = 0;

    this.nextStep();
  }



  getClients(){

  }
  onScroll(){

  }
  

  




  // ------------------------------------------------------------------------------









  nextStep(){
    //console.log("Contenu de tousLesBatiments :", this.tousLesBatiments);
    this.step++;
    switch (this.step) {
      case 0:
        this.width="w-2"
        this.color=["text-blue-600","","",""]

        break;
        case 1:
          this.width="w-1/3"
          this.color=["text-blue-600","text-blue-600","",""]
          break;
          case 2:
          if(this.checkFactureNumber()){
          this.width="w-2/3"
          this.color=["text-blue-600","text-blue-600","text-blue-600",""]
          }
        break;
        case 3:
          if(this.checkFactureChiffres())
          this.champsClientValue["FactureNumber"]=this.factureNumber+''
         { this.getTotal()
        this.width="w-full"
        this.color=["text-blue-600","text-blue-600","text-blue-600","text-blue-600"]}
        break;

    }

  }
  previousStep(){
    this.step--;
    switch (this.step) {
      case 0:
        this.width="w-2"
        this.color=["text-blue-600","","",""]
        break;
        case 1:
          this.width="w-1/3"
          this.color=["text-blue-600","text-blue-600","",""]
          break;
          case 2:
        this.width="w-2/3"
        this.color=["text-blue-600","text-blue-600","text-blue-600",""]
        break;
        case 3:

        this.width="w-full"
        this.color=["text-blue-600","text-blue-600","text-blue-600","text-blue-600"]
        break;

    }
  }

  titleInit(){

  }

  stock(){
    this.router.navigateByUrl('/toutesZones');

  }
    checkFactureChiffres():boolean{
      let result=true
      this.champsFacture.forEach((champ)=>{
         if(/^[0-9]+$/.test(this.champsClientValueFacture[champ].toString())===false)
         {alert("les entrees de la facture il faut quil soient des nombres")
        this.step--;
        result=false
      }})

      return result
    }

    checkFactureNumber():boolean{

      if(typeof(this.factureNumber)!="number"){
        alert("le nombre de facture il faut quil etre un nombre")
        this.step--;
        return false
      }
      return true
    }

    getTotal(){

      this.Total=this.sommeRecord(this.champsClientValueFacture)
      this.NetPayer=this.Total

    }


    sommeRecord(tab:any):number{
      let total=0;
      for (const [cle, valeur] of Object.entries(tab)) {
        total+=parseInt(valeur as string)
      }
      return total
    }

  private formatDate(date: Date): string {
    const day: string = this.padZero(date.getDate());
    const month: string = this.padZero(date.getMonth() + 1); // Les mois sont indexés de 0 à 11
    const year: number = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
