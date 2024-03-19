import { Component, OnInit } from "@angular/core";
import { FloorService } from "../service/floor.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  csvData: any;
  isLoggedIn: boolean;

  constructor(private floorService: FloorService) { 
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  loadCSVData(file_path: string) {
    this.floorService.getCSVData(file_path).subscribe(
      response => {
        this.csvData = response.data;
        console.log('Données CSV récupérées avec succès');
      },
      error => {
        console.error('Une erreur s\'est produite lors de la récupération des données CSV:', error);
      }
    );
  }
}