import { Component } from '@angular/core';
import { FloorService } from '../service/floor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-archi',
  templateUrl: './archi.component.html',
  styleUrls: ['./archi.component.css']
})
export class ArchiComponent {
  
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
  equipementSelectionne: string = ''; // Équipement sélectionné
  nouveauEquipement: string = ''; // Nouvel équipement ajouté par l'utilisateur
  autreEquipement: string = '';


  boutonsAjouterEnfonce: boolean = false;
  boutonsAjouterEtageEnfonce: boolean[] = [];
  boutonsAjouterLocalEnfonce: boolean[] = [];
  boutonsAjouterEquipementEnfonce: boolean[] = [];
  ajoutTermine: boolean = false;
  nombreBatiments: number = 1;
  typeBatiment: string = '';
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
  nomsBatiment: string = '';
  typesBatiments: string='';
  indiceEtageCourant: number = 0;
  indiceZoneCourant: number = 0;
  indiceEtage2Courant: number = 0;
  indiceEtage3Courant: number = 0;
  indiceEquipementCourant: number=0;
  nomsEtages: string[] = [];
  nomsEquipements:string[]=[];
  nomsZones: string[] = [];

  temperatureMin:number[]=[]
  temperatureMax:number[]=[]
  humiditeMin:number[]=[]
  humiditeMax:number[]=[]
  typesBatiment: string = '';
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
  batimentId: number = 0;
  categorieSelectionnee: string[] = [];
  typeLocalSelectionne: string[] = [];
  typesBatimentsSelectionne:string[] = [];
  typeEquipementSelectionne: string[] = [];
  typeBatimentSelectionne: string = '';
  index = 0;
  batimentAjoute: boolean = false;
  constructor(private router: Router,private floorService : FloorService) {}
  /* steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4']; */
  steps = ['Step 1', 'Step 2', 'Step 3'];
  currentStep = 1;
  ajouterNew(nomBatiment: string,typeBatiment:string) {
    this.floorService.ajouterBatiment(nomBatiment,typeBatiment).subscribe(
      (response) => {
        this.batimentId = response.id;
        console.log('ID du batiment ajouté :', this.batimentId);
        
        this.typeBatimentSelectionne=typeBatiment;
        
        console.log(' nom  Bâtiment  :', nomBatiment);
      
        console.log('type Bâtiment  :', typeBatiment);
          // Vous pouvez effectuer des actions supplémentaires ici si nécessaire
      },
      (error) => {
          console.error('Erreur lors de l\'ajout du bâtiment :', error);
          // Vous pouvez gérer l'erreur ici si nécessaire
      }
  );
  this.batimentAjoute = true;
  this.boutonsAjouterEnfonce=true;
    
}
generateBuildingNames() {
  this.nomsBatiments = [];
  for (let i = 0; i < this.nombreBatiments; i++) {
    this.nomsBatiments.push('');
  }
  this.boutonsAjouterEtageEnfonce = Array(this.nombreEtages).fill(false);
  this.boutonsAjouterLocalEnfonce = Array(this.nombreZones).fill(false);
  this.boutonsAjouterEquipementEnfonce = Array(this.nombreEquipements).fill(false);
}
ajouterNewEtage(nomBatiment: string,typeBatiment: string,id:number,index:number) {
  //this.tousLesEtagesSansException.push(nomBatiment);

  this.floorService.ajouterEtage(nomBatiment, id).subscribe(
    (response) => {
      const etageId = response.id;
      console.log('ID de l\'étage ajouté :', etageId);
      this.tousLesEtagesSansException.push(response.id);
      this.tousLesNomsEtagesSansException.push(nomBatiment);
      this.tousLesNomsEtages.push(nomBatiment);
      this.tousLesTypesEtages.push(typeBatiment);
      console.log('Étage ajouté avec succès :', response);
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
ajouterNewZone(nomBatiment: string,id:number,index:number,maxT:number,minT:number,maxH:number,minH:number) {
  //this.tousLesZonesSansException.push(nomBatiment);
  this.floorService.ajouterZoneArchi(nomBatiment, id,maxT,minT,maxH,minH).subscribe(
    (response) => {
      const zoneId = response.id;
      this.floorService.genererDATA(zoneId,minT!,maxT!,minH,maxH).subscribe(
        (response) => {

        }
    )
      console.log('ID de la zone ajoutée :', zoneId);
      this.tousLesZonesSansException.push(response.id);
      this.tousLesNomsZonesSansException.push(nomBatiment);
      this.tousLesNomsLocaux.push(nomBatiment);

      console.log('Étage ajouté avec succès :', response);
    },
    (error) => {
      console.error('Erreur lors de l\'ajout de l\'étage :', error);
    }
  );

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
      this.nombreZones=0;
      this.nomsZones=[];
      this.temperatureMax=[];
      this.temperatureMin=[];
      this.humiditeMax=[];
      this.humiditeMin=[];
      this.boutonsAjouterLocalEnfonce = Array(this.nombreZones).fill(false);


}
categorieChangeEquipement(index: number) {
  // Réinitialisez le type de local sélectionné pour cette zone

   this.typeEquipementSelectionne[index] = '';
   if (this.categoriesEquipements[index] != 'Autre') {
   this.categoriesEquipements=  ['CVC','Équipements Médicaux', 'Équipements de Laboratoire', 'Équipements de Bureau', 'Équipements de Restauration', 'Équipements de Soins', 'Équipements de Radiologie', 'Équipements de Physiothérapie', 'Équipements de Chirurgie', 'Équipements de Surveillance', 'Autre'];
 }
}
ajouterNewEquipement(nomBatiment: string,id:number, index:number) {
  //this.tousLesZonesSansException.push(nomBatiment);
  this.floorService.ajouterEquipementArchi(nomBatiment, id).subscribe(
    (response) => {
      const equipementId = response.id;
      console.log('ID de l equipement ajoutée :', equipementId);
      this.tousLesEquipementsSansException.push(response.id);
      this.tousLesNomsEquipementsSansException.push(nomBatiment);
      this.tousLesNomsEquipements.push(nomBatiment);
      console.log('Étage ajouté avec succès :', response);
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
stock(){
  this.router.navigateByUrl('/toutesZones');

}
  cmpt=0;
  otherAdd=false;
  nextStep() {
    if(this.cmpt===1){

       this.otherAdd=true;
       console.log(this.otherAdd);
    }
    console.log(this.currentStep);
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
      if(this.currentStep === 3){
        this.cmpt=1;
       
    }
    console.log(this.currentStep);
    }
  }
  nextBatiment() {
    this.otherAdd = false;
    this.cmpt = 0;
    window.location.reload();
    this.router.navigateByUrl('/archi');


  }
  finish() {
    this.otherAdd = false;
    this.cmpt = 0;
    this.router.navigateByUrl('/toutesZones');
    
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step <= this.currentStep) {
      this.currentStep = step;
    }
  }
}
