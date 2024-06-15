import * as Highcharts from 'highcharts';
import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FloorService } from 'src/app/service/floor.service';
import { forkJoin } from 'rxjs';
import { WebSocketService } from 'src/app/service/web-socket.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnChanges {

  initialData: any[] = [
    { name: 'critique', data: [13790468.0450, 12630468.045, 10800468.045, 11630468.045,12700468.045, 10000000] },
    { name: 'non critique', data: [793645.04, 793645.04, 793645.04, 793645.04, 793645.04 ,600000] },
    { name: 'tous', data: [12930468.045, 12930468.045, 12930468.045, 12930468.045,12930468.045, 10000000] }, //  { name: 'tous', data: [11630468.045, 11630468.045, 11630468.045, 11630468.045, 11630468.045, 11630468.045] }
  ];  
  filteredData: any[] = [];
  tous: any[] = [];
  tousjuin: any;
  critiquejuin: any;
  @Input() message: any;
  normaljuin: any;
  webSocket: any[] = [];
  constructor(private wsService: WebSocketService,private floorService: FloorService) { }

  ngOnInit(): void {
    //this.initializeData();
    this.initialData = [
      { name: 'critique', data: [13790468.0450, 12630468.045, 10800468.045, 11630468.045,12700468.045, 10000000] },
      { name: 'non critique', data: [793645.04, 793645.04, 793645.04, 793645.04, 793645.04 ,600000] },
      { name: 'tous', data: [12930468.045, 12930468.045, 12930468.045, 12930468.045,12930468.045, 10000000] }, //  { name: 'tous', data: [11630468.045, 11630468.045, 11630468.045, 11630468.045, 11630468.045, 11630468.045] }
    ];
    this.renderChart(this.initialData);
   /*  this.wsService.connectequipement().subscribe(
      (message) => {
        console.log('Received message:', message);
        this.webSocket.unshift(message.message);
        this.updateData(message);
      }) */

  }


  updateData(message: any): void {
    if (message && typeof message.critique !== 'undefined' && typeof message.normal !== 'undefined') {
      const critiquejuin = message.critique;
      const normaljuin = message.normal;
      const tousjuin = critiquejuin + normaljuin;

      this.initialData = [
        { name: 'critique', data: [53037.88
        , 53137.1212
        , 40000.5345
        , 49457.9
        , 46271.3
        , critiquejuin] },
        { name: 'non critique', data: [40100.26
        , 40000.1212
        , 42232.5345, 49457.9
        , 46271.3, normaljuin] },
        { name: 'tous', data: [62306.601388894
        , 56528.615555584
        , 62023.65944443
        , 66407.762777776
        , 54413.726341434
        , tousjuin] }
        
      ];
      this.renderChart(this.initialData);
    } else {
      console.error('Invalid data format:', message);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message']) {
      //console.log('Message:', this.message);
      this.updateData(this.message);
    }
    if (changes['selectedOption']) {
      this.filterData();
    }
  }

  /* initializeData(): void {
    this.floorService.getSauvegardeData().subscribe((data: any) => {
      this.tous = data;
      console.log('***************data', data);
      this.loadData();
    });
  } 

  loadData(): void {
    const dateDebut = '2024-06-01 00:00:00';
    const dateFin = '2024-06-18 00:00:00';

    forkJoin([
      this.floorService.getHopitalConsommationPendantMoisNormal(dateDebut, dateFin),
      this.floorService.getHopitalConsommationPendantMoisCritique(dateDebut, dateFin)
    ]).subscribe(([normalData, critiqueData]: [any, any]) => {
      this.normaljuin = normalData;
      this.critiquejuin = critiqueData;
      console.log('normaljuin', this.normaljuin);
      console.log('critiquejuin', this.critiquejuin);

      this.tousjuin = this.normaljuin + this.critiquejuin;

      this.initialData = [
        { name: 'critique', data: [13790468.0450, 12630468.045, 10800468.045, 11630468.045,12700468.045, this.critiquejuin] },
        { name: 'non critique', data: [793645.04, 793645.04, 793645.04, 793645.04, 793645.04, this.normaljuin] },
        { name: 'tous', data: [12930468.045, 12930468.045, 12930468.045, 12930468.045,12930468.045, this.tousjuin] }
      ];

      this.renderChart(this.initialData);
    });
  }
*/
  renderChart(data: any[]): void {
    Highcharts.chart('container', {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
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

  filterData(): void {
    if (this.selectedOption === 'all') {
      this.filteredData = this.initialData;
    } else {
      this.filteredData = this.initialData.filter(item => item.name === this.selectedOption);
    }
    this.renderChart(this.filteredData);
  }
}