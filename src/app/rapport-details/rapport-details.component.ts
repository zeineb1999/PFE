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
}