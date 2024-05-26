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
  page: string = '';

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
      }
    })

  }
  decisionValidated: boolean = false;

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
    this.floorService.createHistorique(this.rapport, this.selectedOption,this.equipement,"").subscribe(
          (data: any) => {
            console.log(data);
          },
          (error) => {
            console.log(error);
          }
        );
    }
    if(this.selectedOption=='arret'){
     
      this.floorService.createEquipementArchive(this.equipement.nom,this.equipement.categorie,this.equipement.puissance,this.equipement.zoneE).subscribe(()=>{})
      this.floorService.deleteEquipement(this.equipement.id).subscribe(() => {
        
      })
    }
    if(this.selectedOption == 'remplacer'){
      this.floorService.createEquipementArchive(this.equipement.nom,this.equipement.categorie,this.equipement.puissance,this.equipement.zoneE).subscribe(()=>{})
    
      this.floorService.deleteEquipement(this.equipement.id).subscribe(() => {
        
      })
      console.log("zoneE",this.equipement.zoneE,"id equ",this.equipement.id,"id rappo",this.rapport.id)

      this.router.navigate(['/ajouterEquipementRemplacement', this.equipement.zoneE, this.equipement.id,this.rapport.id]);

     
     
    }
  
        
    

  }
}