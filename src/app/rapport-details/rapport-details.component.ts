import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FloorService } from 'src/app/service/floor.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-rapport-details',
  templateUrl: './rapport-details.component.html',
  styleUrls: ['./rapport-details.component.css']
})
export class RapportDetailsComponent {
  selectedOption: any;
  roleUser: string | null ='';
  alerteId: number=0;
  rapport: any;
  isLoggedIn: boolean;
  equipement: any;
  cout!:number;
  demandeCout!:boolean;
  equipementRemplacer:any;
  page: string = '';
  decisionValidated: boolean = false;
  approvation:boolean=false;
  selectedApp:any;
  constructor(private authService: AuthService,private route: ActivatedRoute, private router: Router, private floorService: FloorService) {this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; }

  ngOnInit() {
    this.roleUser=sessionStorage.getItem('role');
    this.alerteId = parseInt(this.route.snapshot.paramMap.get('alerteId') || '');
    console.log('alerteid: ', this.alerteId)

    this.floorService.getRapportsByAlerteId(this.alerteId).subscribe((rapport: any) => {
      console.log('rapport: ', rapport)
      if (rapport && rapport.length > 0) {
        this.rapport = rapport[0]
        console.log('rapport: ', rapport)
        if(this.rapport){
          this.floorService.getEquipementDetails(this.rapport.equipement).subscribe((equipement: any) => {
            this.equipement = equipement
            console.log('ee', equipement)
          })
        }
        if(this.rapport.decision==="remplacer"){
          this.floorService.getEquipementAjouterDetails(this.rapport.id).subscribe((equipement: any) => {
            this.equipementRemplacer = equipement

            console.log('ee',  this.equipementRemplacer[0].puissance )
          })
          
        }
      }
    })

  }


  validateChoice() {

    console.log('equipement:', this.equipement.id);

    this.decisionValidated = true; // Mark the decision as validated

    this.floorService.addDecision(this.rapport.id, this.selectedOption).subscribe(
      (data: any) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
    if(this.selectedOption != 'remplacer'){
      this.demandeCout=true
   /*  this.floorService.createHistorique(this.rapport, "remplacer",this.equipement,"").subscribe(
          (data: any) => {
            console.log(data);
          },
          (error) => {
            console.log(error);
          }
        ); */
        
    }
   /*  if(this.selectedOption=='arret'){
     // supprimer periode 
      this.floorService.createEquipementArchive(this.equipement.nom,this.equipement.categorie,this.equipement.puissance,this.equipement.zoneE).subscribe(()=>{})
      this.floorService.deletePeriode(this.equipement.id).subscribe(()=>{})
      this.floorService.deleteEquipement(this.equipement.id).subscribe(() => {
        
      })
    } */
    if(this.selectedOption == 'remplacer'){
      //supprimer periode 
      
      this.router.navigate(['/ajouterEquipementRemplacement', this.equipement.zoneE, this.equipement.id,this.rapport.id]);

     
     
    }
  
        
    

  }
  approuver() {
    this.selectedApp="approuver"
    this.approvation=true
    this.floorService.addApprovation(this.rapport.id,"true").subscribe(
      (data: any) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
   
    
    if(this.rapport.decision='remplacer'){
      const equipementData = {
        nom: this.equipementRemplacer[0].nom,
        etat: 'ON',
        categorie: this.equipementRemplacer[0].categorie,
        puissance: this.equipementRemplacer[0].puissance,
        zoneE: this.equipementRemplacer[0].zoneE,
        minC:this.equipementRemplacer[0].minC,
        maxC:this.equipementRemplacer[0].maxC,
        type:this.equipementRemplacer[0].type
      };

      console.log("equipementData: ",equipementData);
      this.floorService.addEquipement(equipementData).subscribe(
        (data: any) => {
          const equipementId = data.id;
          console.log("donnes histo  rapport",this.rapport,"equi remp",this.equipement.id,equipementId);
          this.floorService.createHistoriqueRemplacement(this.rapport, "remplacer",this.equipement.id,equipementId).subscribe(
            (data: any) => {
              console.log("done ",data);
  
            },
            (error) => {
              console.log(error);
            }
          );
      
          this.floorService.generatePeriode(equipementId).subscribe(
            (data: any) => {
             
            },
            error => {
              console.log(error);
            }
          )
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );

    this.floorService.createHistorique(this.rapport, this.rapport.decision,this.equipement,"").subscribe(
                (data: any) => {
                  console.log(data);
                },
                (error) => {
                  console.log(error);
                }
              );
    
      this.floorService.createEquipementArchive(this.equipement.nom,this.equipement.categorie,this.equipement.puissance,this.equipement.zoneE).subscribe(()=>{})
      this.floorService.deletePeriode(this.equipement.id).subscribe(()=>{})
      this.floorService.archiveEquipement(this.equipement.id).subscribe(() => {
        
      })
      
    }
    if(this.rapport.decision != 'remplacer'){
      this.floorService.createHistorique(this.rapport, this.rapport.decision,this.equipement,"").subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => {
              console.log(error);
            }
          );
   }
  }
  desapprouver(){
    this.selectedApp="désapprouver"
    this.approvation=true
    this.floorService.addApprovation(this.rapport.id,"false").subscribe(
      (data: any) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
   
    if(this.rapport.decision='remplacer'){
      this.floorService.deleteEquipementAjouter(this.equipementRemplacer[0].id).subscribe(
        (data: any) => {
        
        },
        (error) => {
          console.log(error);
        }
      );

    }
  

  }
  confirmerCout(){

    this.floorService.addCout(this.rapport.id, this.cout).subscribe(
      (data: any) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
    this.demandeCout=false
    
  }
}