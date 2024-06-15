import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FloorService } from 'src/app/service/floor.service';
import { AuthService } from '../service/auth.service';

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

@Component({
  selector: 'app-alerte-details',
  templateUrl: './alerte-details.component.html',
  styleUrls: ['./alerte-details.component.css']
})
export class AlerteDetailsComponent {

  alerteId: number | undefined;
  isLoggedIn: boolean;
  responsables_maintenance : any[] = []
  thisAlerte : any;
  Rid: number = 0;

  utilisateurs: any[] = [];
  usersStock:any;
  userRole: any;
  roleUser: any;
  user: any;
  role: string = '';
  roles: string[] = [];
  local: Local | undefined;
  etage: any;
  page: string = '';
  alerteMText: string='';

  @Output() alerteChangeA = new EventEmitter<AlertData>();
  batiment: any;
  rapport: any;

  emitAlert(localId: number, nomLocal: string, type: string, nowSlash: any, alerteId: number, userID: number) {
    let notifie = false;
    let vu = false;
    let data : AlertData = {localId, nomLocal, type, nowSlash, alerteId, userID, notifie, vu}
    this.alerteChangeA.emit(data);
    console.log('alerte envoyé: ', data)
  }

  constructor(private authService: AuthService,private route: ActivatedRoute, private router: Router, private floorService: FloorService) {this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; }

  ngOnInit() {
   
    this.roleUser=sessionStorage.getItem('role');
    console.log('roleUser:---------> ', this.roleUser)
    //window.location.reload();

    this.alerteId = parseInt(this.route.snapshot.paramMap.get('alerteId') || '');

    this.floorService.getAlerte(this.alerteId).subscribe(
      ((alerte: any) =>{
        this.thisAlerte = alerte
        console.log('*********************************   alerte iciiiiii: ', alerte)
        this.thisAlerte.vu = true

        this.floorService.getRapportsByAlerteId(this.thisAlerte.id).subscribe((rapports: any) => {
          this.rapport = rapports
          console.log('rap: ', rapports)
        })
        
        this.floorService.getZoneDetails(this.thisAlerte.localId).subscribe((thisLocal: any) => {
          this.local = thisLocal
          console.log('rrrrrr', thisLocal)
          this.floorService.getEtageById(thisLocal.etageZ).subscribe((etage: any) => {
            console.log('etage', etage)
            this.etage = etage
            this.floorService.getBatimentById(etage.batimentId).subscribe((batiment: any) => {
              this.batiment = batiment;
              console.log('bat: ', batiment)
            })
          })
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

  /* batiment(batiment: any, arg1: string, batiment1: any) {
    throw new Error('Method not implemented.');
  } */
  userLast(id:number):string{

    console.log('id',id)
    for (const batiment of this.utilisateurs) {
      if (batiment.id === id) {
        return batiment.last_name;
      }
    }
    throw new Error(`Aucun bâtiment trouvé avec l'ID ${id}`);

    
  }
  userFirst(id:number):string{
    console.log('id',id)
    for (const batiment of this.utilisateurs) {
      if (batiment.id === id) {
        return batiment.first_name;
      }
    }
    throw new Error(`Aucun bâtiment trouvé avec l'ID ${id}`);

  }
  sendNotification(idAlerte: number) {

    if (this.Rid) {
      const idUser = this.Rid;
      console.log('************id User ', idUser);
/*
      let now =new Date()
      this.floorService.addAlerte(1 ,'maintenance', now, this.alerteMText, 0).subscribe(
        (alerte: any) => {
          console.log(now)
          console.log('notif envoyé: ', alerte)
          if (this.local) {
            this.emitAlert(1, 'salle', 'maintenance', now, alerte.id, this.Rid);
          }
        })

 */
      /* if (this.local) {
        let now =new Date()
        this.floorService.addAlerte( this.local.id,'maintenance', now).subscribe(
          (alerte: any) => {
            console.log(now)
            console.log('notif envoyé: ', alerte)
            if (this.local) {
              this.emitAlert(this.local.id, this.local.nomLocal, 'maintenance', now, alerte.id, this.Rid);
            }
          })
      } */
      this.floorService.addUserAlerte(idAlerte, idUser).subscribe(
        (response => {
           this.router.navigate(['/rapport']);
        }))
       
        // Gérer la réponse de l'API ou les éventuelles erreurs
      
    } else {
      console.log('Sélectionnez un responsable de maintenance.');
    }
  }

  redirectToRedigerRapport() {
    if (this.thisAlerte) {
      this.router.navigate(['/rediger-rapport', this.thisAlerte.id]);
    }
  }



}