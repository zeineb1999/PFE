import { Component, OnInit } from '@angular/core';
import { FloorService } from '../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.css']
})
export class RapportComponent implements OnInit {
  isLoggedIn: boolean;
  nbAlertes: number = 0;
  seenFilter: string = '';
  users: any[] = [];
  periodeFilter: string = '';
  alerteAChercher: any = undefined;
  constructor(private route: ActivatedRoute, private router: Router,private floorService: FloorService, private authService: AuthService){this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; }
  rapports: any[] = [];
  alertes: any[] = [];
  typeFilter: string = '';
  loadingPromise: Promise<any> | null = null;

  ngOnInit(): void {
    this.authService.getAllusers().subscribe((users: any[]) => {
      this.users = users;
    })
    this.loadAlertes();
  }

  async loadAlertes(): Promise<void> {
    this.alertes = []
    // Vérifiez si l'exécution est déjà en cours
    if (this.loadingPromise !== null) {
      // Si c'est le cas, résolvez la promesse actuelle pour l'annuler
      await this.loadingPromise;
    }

    // Créez une nouvelle promesse pour cette exécution
    this.loadingPromise = new Promise<void>((resolve) => {
      this.alertes = []
      this.nbAlertes = 0;
      let annee: number, mois: number;
      this.floorService.getAllAlertes().subscribe((alertes: any) => {
        console.log(alertes)
        alertes.forEach((alerte: any) => {
          console.log('cond: ', (alerte.type != 'maintenance' && (alerte.type == this.typeFilter || this.typeFilter == '') && (alerte.vu.toString() == this.addSeenFilter || this.seenFilter=='')))
          if (alerte.type != 'maintenance' && (alerte.type == this.typeFilter || this.typeFilter == '') && (alerte.vu.toString() == this.seenFilter || this.seenFilter=='') && (alerte.id == this.alerteAChercher || !this.alerteAChercher)) {

            if (alerte.dateAlerte) {
              annee =parseInt(alerte.dateAlerte.split('T')[0].split('-')[0])
              mois = parseInt(alerte.dateAlerte.split('T')[0].split('-')[1])
              alerte.dateAlerte = annee+'/'+ mois + '/' + alerte.dateAlerte.split('T')[0].split('-')[2] + ' '+ alerte.dateAlerte.split('T')[1].split(':')[0] + ':'+alerte.dateAlerte.split('T')[1].split(':')[1]
            }
            console.log(annee, ' = ', new Date().getFullYear(), '  ', mois , '=', new Date().getMonth()+1)

            if((this.periodeFilter == 'mois' && mois == new Date().getMonth()+1 && annee == new Date().getFullYear()) ||
              (this.periodeFilter == '') ||
              (this.periodeFilter == 'annee' && annee == new Date().getFullYear())
            ) {
              if (alerte.userID) {
                alerte.user = this.users.find(user => user.id === alerte.userID);
              } else {
                alerte.user = this.users.find(user => user.Role === 'Moyen generaux');
              } 

              this.floorService.getRapportsByAlerteId(alerte.id).subscribe((rapport: any[]) => {
                //console.log("********************* r: ", rapport)
                alerte.rapports = rapport;
                //console.log('alerte; ',alerte)
                if (!this.alertes.find(al => al.id == alerte.id)) {
                  this.alertes.push(alerte)
                  this.nbAlertes ++
                }
              })
            }

          }
        });
      })

      setTimeout(() => {
        console.log('Loading complete');
        resolve();
      }, 5000);
    });

    // Attendre la fin du chargement
    await this.loadingPromise;

    // Effacez la promesse une fois terminée
    this.loadingPromise = null;


  }
  userLast(id:number):string{
    for (const batiment of this.users) {
      if (batiment.id === id) {
        return batiment.last_name;
      }
    }
    throw new Error(`Aucun bâtiment trouvé avec l'ID ${id}`);

    
  }
  userFirst(id:number):string{
    for (const batiment of this.users) {
      if (batiment.id === id) {
        return batiment.first_name;
      }
    }
    throw new Error(`Aucun bâtiment trouvé avec l'ID ${id}`);

  }

  addTypeFilter(type: string) {
    this.alertes = [];
    this.typeFilter = type;
    this.loadAlertes()
  }

  addSeenFilter(state: string) {
    this.alertes = [];
    this.seenFilter = state;
    this.loadAlertes()
  }

  addPeriodeFilter(periode: string) {
    this.alertes = [];
    this.periodeFilter = periode;
    this.loadAlertes()
  }

  Chercher() {
    console.log('rr', this.alerteAChercher)
    if (this.alerteAChercher) {
      this.alertes = [];
      this.loadAlertes()
    }
  }

  stopExecution(): void {
    if (this.loadingPromise !== null) {
      // Si une exécution est en cours, résolvez la promesse pour l'annuler
      this.loadingPromise = Promise.resolve();
    }
  }

  goToRapportDetails(id: any) {
    console.log('id: ', id)
    this.router.navigate(['/rapport-details', id.alerte]);
  }

}