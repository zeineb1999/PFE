import { Component, OnInit } from "@angular/core";
import { FloorService } from "../service/floor.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  csvData: any;
  isLoggedIn: boolean;
  excelData: any;
  currentIndex: number = 0;

  constructor(private floorService: FloorService) { 
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnInit(): void {
    this.getExcelData();
  }

  getExcelData(): void {
    this.floorService.getExcelData().subscribe(data => {
      this.excelData = data;
      this.updateDataEverySecond();
    });
  }

  updateDataEverySecond(): void {
    setInterval(() => {
      if (this.currentIndex < this.excelData.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
    }, 1000); // Met à jour les données chaque seconde
  }
}
