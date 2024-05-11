import * as Highcharts from 'highcharts';
import { Component, OnInit } from '@angular/core';
import { FloorService } from 'src/app/service/floor.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  initialData: any[] = [
    { name: 'critique', data: [12000, 13400, 15000, 14000, 12000, 14998] },
    { name: 'non critique', data: [12000, 12340, 10000, 11000, 16000, 14998] },
    { name: 'tous', data: [33000, 33400, 35000, 34000, 32000, 34998] }
  ];  
  //initialData : any[] = [ ];
  filteredData: any[] = [];
  constructor(private floorService: FloorService) { }

  ngOnInit(): void {
    this.initializeData();
    if(this.initialData.length > 0) {
    this.renderChart(this.initialData);
    }
  }
  initializeData(): void {
    this.floorService.getInitialData().subscribe((data: any) => {
      console.log('***************data',data);
      this.initialData = data; // Assignez les données initiales à la propriété
    });
  }
  renderChart(data: any[]): void {
    Highcharts.chart('container', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Consommation des équipements'
      },
      xAxis: {
        categories: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin']
      },
      yAxis: {
        title: {
          text: 'Consommation' 
        }
      },
      series: data
    });
  }

selectedOption: string = 'all'; // Default value

filterData() {
  if (this.selectedOption === 'all') {
    this.filteredData = this.initialData;
  } else {
    this.filteredData = this.initialData.filter(item => item.name === this.selectedOption);
  }
  this.renderChart(this.filteredData);
}
  
  

}
