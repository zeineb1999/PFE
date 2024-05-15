import { Component, OnInit } from '@angular/core';
import { FloorService } from '../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.css']
})
export class RapportComponent implements OnInit {
  isLoggedIn: boolean;
  constructor(private route: ActivatedRoute, private router: Router,private floorService: FloorService){this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; }
  rapports: any[] = [];
  typeFiltre: string = ''; // Propriété pour stocker la valeur du filtre de type sélectionné
  types: string[] = ['lu','Non lu']; // Array pour stocker les types uniques
  rapportsFiltre: any[] = [];
  ngOnInit(): void {
    this.floorService.getAllRapports().subscribe(rapports => {
      console.log('rapports: ',rapports);
      this.rapports = rapports;
      if(this.typeFiltre === '') {
      console.log('this.typeFiltre: ',this.typeFiltre);
      this.rapportsFiltre = this.rapports;
      console.log('rapportsFiltre: ',this.rapportsFiltre);
      }
      console.log('after rapports: ',rapports);
    })
    
  }
  goToRapportDetails(id: any) {
    console.log('id: ', id)
    this.router.navigate(['/rapport-details', id.alerte]);
    
  }
  filtrerEquipements() {
    if (this.typeFiltre === '') {
        this.rapportsFiltre = this.rapports.slice();
    } else if (this.typeFiltre === 'lu') {
        this.rapportsFiltre = this.rapports.filter(rapport => rapport.vu === true);
    } else if (this.typeFiltre === 'Non lu') {
        this.rapportsFiltre = this.rapports.filter(rapport => rapport.vu === false);
    }


    
    }

}
