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
  /* data: any[] = [
    // Example data
    { id: 3, batiment: 'Besique Monroe', utilisateur: 'Administrator', createdAt: 'Sep 28, 2022', status: 'Active' },
    { id: 7, batiment: 'James Cavier', utilisateur: 'Author', createdAt: 'Sep 28, 2022', status: 'Active' },
    { id: 12, batiment: 'Elvis Son', utilisateur: 'Editor', createdAt: 'Sep 28, 2022', status: 'Suspended' },
    { id: 66, batiment: 'Dana White', utilisateur: 'Administrator', createdAt: 'Sep 28, 2022', status: 'Inactive' },
  ]; */

  constructor(private floorService: FloorService, private authService: AuthService) {}

  ngOnInit(): void {
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
    // Spécifier le type de l'argument 'batiment' dans la fonction 'find'
    let batiment = this.batiments.find((batiment: any) => batiment.id === id);

    // Vérifier si le bâtiment a été trouvé avant d'accéder à ses propriétés
    if (batiment) {
      return batiment.nomBatiment;
    } else {
      // Gérer le cas où aucun bâtiment n'a été trouvé
      throw new Error(`Aucun bâtiment trouvé avec l'ID ${id}`);
      // return "Bâtiment non trouvé"; // Ou vous pouvez retourner une chaîne par défaut
    }
  }

  
  EtageNom(id:number): string {
    let batiment = this.etages.find((batiment: any) => batiment.id === id);

    // Vérifier si le bâtiment a été trouvé avant d'accéder à ses propriétés
    if (batiment) {
      return batiment.nomEtage;
    } else {
      // Gérer le cas où aucun bâtiment n'a été trouvé
      throw new Error(`Aucun bâtiment trouvé avec l'ID ${id}`);
      // return "Bâtiment non trouvé"; // Ou vous pouvez retourner une chaîne par défaut
    }

  }
  LocalNom(id:number): string {
    let batiment = this.etages.find((batiment: any) => batiment.id === id);

    // Vérifier si le bâtiment a été trouvé avant d'accéder à ses propriétés
    if (batiment) {
      return batiment.nomLocal;
    } else {
      // Gérer le cas où aucun bâtiment n'a été trouvé
      throw new Error(`Aucun bâtiment trouvé avec l'ID ${id}`);
      // return "Bâtiment non trouvé"; // Ou vous pouvez retourner une chaîne par défaut
    }

  }
  userLast(id:number):string{
    return ""
  }
  userFirst(id:number):string{
    return ""
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
