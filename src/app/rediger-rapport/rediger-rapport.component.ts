import { Component, ElementRef, Renderer2, Input } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FloorService } from 'src/app/service/floor.service';
import { AuthService } from '../service/auth.service';
import { Equipement } from '../service/floor.service';

interface Local {
  id: number;
  nomLocal: string;
  typeLocal: string;
  etageZ: number;
}

interface AlertData {
  localId: number;
  nomLocal: string;
  type: string;
  nowSlash: string;
  alerteId: number;
  userID: number;
  notifie: any;
  vu: any;
}

interface EquipementNecessite {
  equipement: string;
  necessite: string;
}

interface Rapport {
  alerte: number;
  redacteur : number;
  causes : string;
  equipementsEndommages : Equipement;
  solutions : string;
  risques : string;
  equipementsDemandes : string;
  equipementsNecessites : string;
}

@Component({
  selector: 'app-rediger-rapport',
  templateUrl: './rediger-rapport.component.html',
  styleUrls: ['./rediger-rapport.component.css']
})

export class RedigerRapportComponent {


  alerteId: number | undefined;
  isLoggedIn: boolean;
  responsables_maintenance : any[] = []
  thisAlerte : any;
  Rid: number = 0;

  utilisateurs: any[] = [];

  userRole: any;
  user: any;
  role: string = '';
  roles: string[] = [];
  local: Local | undefined;
  etage: any;
  page: string = '';
  alerteMText: string='';
  batiment: any;
  successMessage: any;
  cause: any;
  thisCause: string = '';

  nbCauses: number = 1;
  causes: string[] = [''];
  causesM: string[] = []

  nbEndommage: number = 1;
  endommages: string[] = [''];
  endommagesM: string[] = []

  solutions: string[] = ['']
  solutionsM: string[] = []
  nbSolutions: any;

  risques: string[] = ['']
  risquesM: string[] = []
  nbRisques: any;

  equipements: string[] = ['']
  equipementsM: EquipementNecessite[] = [{equipement: '', necessite:''}]
  nbEquipements: any;
  equipementsLocal: any;
  equipementSelect: any;
  autre: string='';
  userID: number = 0;
  constructor(private authService: AuthService,private route: ActivatedRoute, private router: Router, private floorService: FloorService, private renderer: Renderer2, private el: ElementRef) {this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    this.userID = parseInt(sessionStorage.getItem('id') || '');
   }

  ngOnInit() {

    this.alerteId = parseInt(this.route.snapshot.paramMap.get('alerteId') || '');
    this.floorService.getAlerte(this.alerteId).subscribe(
      ((alerte: any) =>{
        this.thisAlerte = alerte
        this.thisAlerte.vu = true
        this.floorService.getZoneDetails(this.thisAlerte.localId).subscribe((thisLocal: any) => {
          this.alerteMText = 'Vous avez une tâche de maintenance dans ' + thisLocal.nomLocal;
          this.floorService.getEtageById(thisLocal.etageZ).subscribe((etage: any) => {
            this.floorService.getBatimentById(etage.batimentId).subscribe((batiment: any) => {
              this.batiment = batiment;
            })
          })
          console.log('*********localId',this.thisAlerte.localId)
          this.floorService.getEquipementsByZone(this.thisAlerte.localId).subscribe((equipementsLocal: any[]) => {
            this.equipementsLocal = equipementsLocal
          })
          console.log('***************equi',this.equipementsLocal)
        })
        console.log(alerte)
        this.floorService.setAlerteNotifie(alerte.id, this.thisAlerte).subscribe((alerteM: any) => {
          console.log('alerte vu')
        })
      })
    );



    this.authService.getAllusers().subscribe(users => {
      this.utilisateurs = users;
      console.log(this.utilisateurs);

      this.utilisateurs.forEach(utilisateur => {
        console.log('*********** utilisateur ',utilisateur);
        this.authService.getRole(utilisateur.id).subscribe(response => {
          if(response.role=='Responsable de maintenance'){
            console.log('*********** role ',response.role);
            this.responsables_maintenance.push(utilisateur);
          }
          this.roles.push(response.role);
        });
      });
    });
  }

  ajouterCause() {
    this.nbCauses++;
    this.causes.push('');
    console.log('causes: ', this.causesM)
  }

  ajouterEndommage() {
    this.nbEndommage ++;
    this.endommages.push('');
    console.log('causes: ', this.endommagesM)
  }

  ajouterSolution() {
    this.nbSolutions++;
    this.solutions.push('');
    console.log('sols: ', this.solutionsM)
  }

  ajouterRisque() {
    this.nbRisques++;
    this.risques.push('');
    console.log('sols: ', this.risquesM)
  }

  ajouterEquipement() {
    this.nbEquipements++;
    this.equipements.push('');
    this.equipementsM.push({equipement: '', necessite:''})
    console.log('sols: ', this.equipementsM)
  }

  enregistrerRapport() {
    let saveCauses = ''
    let i=0
    this.causesM.forEach((element: string) => {
      if (i == 0) {
        saveCauses=element
        i++
      } else {
        saveCauses = saveCauses + '|' + element
      }
    });

    let j=0
    let saveSolutions = ''
    this.solutionsM.forEach((element: string) => {
      if (j == 0) {
        saveSolutions = element
        j++
      } else {
        saveSolutions = saveSolutions + '|' + element
      }
    });

    let k=0
    let saveRisques = ''
    this.risquesM.forEach((element: string) => {
      if (k == 0) {
        saveRisques = element
        k++
      } else {
        saveRisques = saveRisques + '|' + element
      }
    });

    let l=0
    let saveEquipements = ''
    let saveNecessite = ''
    this.equipementsM.forEach((element: any) => {
      if (l == 0) {
        saveEquipements = element.equipement
        saveNecessite = element.necessite
        l++
      } else {
        saveEquipements = saveEquipements + '|' + element.equipement
        saveNecessite = saveNecessite + '|' + element.necessite
      }
    });
    let now=new Date();
    console.log('now: ', now)
    console.log('equipe',this.equipementSelect)  
    this.floorService.addRapport(this.thisAlerte.id, this.userID, saveCauses, saveSolutions, saveRisques, saveEquipements, saveNecessite,this.equipementSelect,now).subscribe((rapport: any) => {
      console.log('rapport enregistré: ', rapport)
      this.router.navigate(['/rapport']);
    })
  }
}