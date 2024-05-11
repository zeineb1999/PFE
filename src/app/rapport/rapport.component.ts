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
  constructor(private route: ActivatedRoute, private router: Router,private floorService: FloorService){this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; }
  rapports: any[] = [];
  ngOnInit(): void {
    this.floorService.getAllRapports().subscribe(rapports => {
      this.rapports = rapports;
    })
  }
  goToRapportDetails(id: any) {
    console.log('id: ', id)
    this.router.navigate(['/rapport-details', id.alerte]);
    
  }

}
