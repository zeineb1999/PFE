import { Component, OnInit } from '@angular/core';
import { FloorService } from '../service/floor.service';

import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  selectedFilter: string = 'batiment';
  historiqueBatiment: any;
  historiqueEtage: any;
  historiqueZone: any;
  historiqueEquipement: any;
  boolBatiment: boolean = false;
  boolEtage: boolean = false;
  boolZone: boolean = false;
  boolEquipement: boolean = false;
  batiments:any;
  etages:any;
  locaux:any;
  users:any;
 
  constructor(private floorService: FloorService, private authService: AuthService) {}

  ngOnInit(): void {
    this.boolBatiment=true
    this.authService.getAllusers().subscribe((users:any[])=>
    {
      this.users=users;
    })
    this.floorService.getAllBatiments().subscribe((users:any[])=>
    {
        this.batiments=users;
    })
    this.floorService.getAllEtages().subscribe((users:any[])=>
      {
          this.etages=users;
      })
      this.floorService.getAllZones().subscribe((users:any[])=>
        {
            this.locaux=users;
        })
    this.floorService.allHistoriqueBatiment().subscribe((data: any) => {
      this.historiqueBatiment = data;
    });
    this.floorService.allHistoriqueEtage().subscribe((data: any) => {
      this.historiqueEtage = data;
    });
    this.floorService.allHistoriqueZone().subscribe((data: any) => {
      this.historiqueZone = data;
    });
    this.floorService.allHistoriqueEquipement().subscribe((data: any) => {
      this.historiqueEquipement = data;
    });
  }
  dateFormate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formate la date selon les paramètres régionaux
  }

  timeFormate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formate l'heure selon les paramètres régionaux
  }
  BatimentNom(id: number): string {
    console.log("batiment",this.batiments)
    
    for (const batiment of this.batiments) {
      if (batiment.id === id) {
        return batiment.nomBatiment;
      }
    }
    throw new Error(`Aucun bâtiment trouvé avec l'ID ${id}`);
  }

  
  EtageNom(id:number): string {
    console.log("etages",this.etages)
    for (const batiment of this.etages) {
      if (batiment.id === id) {
        return batiment.nomEtage;
      }
    }
    throw new Error(`Aucun bâtiment trouvé avec l'ID ${id}`);

  }
  LocalNom(id:number): string {
    console.log("locaux ",this.locaux)
    for (const batiment of this.locaux) {
      if (batiment.id === id) {
        return batiment.nomLocal;
      }
    }
    throw new Error(`Aucun bâtiment trouvé avec l'ID ${id}`);


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
  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedFilter = target.value;

    this.boolBatiment = this.selectedFilter === 'batiment';
    this.boolEtage = this.selectedFilter === 'etages';
    this.boolZone = this.selectedFilter === 'locaux';
    this.boolEquipement = this.selectedFilter === 'equipemnts';
  }

  /* getFilteredData() {
    if (!this.selectedFilter || this.selectedFilter === 'All') {
      return this.data;
    }
    return this.data.filter(item => item.status === this.selectedFilter);
  } */
}
