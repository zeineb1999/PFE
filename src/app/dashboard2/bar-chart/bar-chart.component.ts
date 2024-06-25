import * as Highcharts from 'highcharts';
import { Component, OnInit, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { FloorService } from 'src/app/service/floor.service';
import { WebSocketService } from 'src/app/service/web-socket.service';
import { forkJoin } from 'rxjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnChanges {

  @Input() message: any;
  initialData: any[] = [];
  filteredData: any[] = [];
  janvierCritique: number = 0;
  janvierNonCritique: number = 0;
 
  fevrierCritique: number = 0;
  fevrierNonCritique: number = 0;
  
  marsCritique: number = 0;
  marsNonCritique: number = 0;
 
  avrilCritique: number = 0;
  avrilNonCritique: number = 0;
  
  maiCritique: number = 0;
  maiNonCritique: number = 0;

  juinCritique: number = 0;
  juinNonCritique: number = 0;
 
  
  Consommation_totale: number = 0;
  sendData: any[] = [];
  selectedOption: string = 'all'; // Default value
  private subscription: Subscription | undefined;
  constructor(private wsService: WebSocketService, private floorService: FloorService) { }

  async ngOnInit(): Promise<void> {
    await this.initializeData();
    this.renderChart(this.initialData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message']) {
      this.updateData(this.message);
    }
    if (changes['selectedOption']) {
      this.filterData();
    }
  }
  ngOnDestroy(): void {
    // Désabonnement de la souscription pour éviter les fuites de mémoire
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  async initializeData(): Promise<void> {
    
      const janvierData = await this.consommationCriticite(1);
      this.janvierCritique = janvierData.critique;
      this.janvierNonCritique = janvierData.noncritique;
  
      const fevrierData = await this.consommationCriticite(2);
      this.fevrierCritique = fevrierData.critique;
      this.fevrierNonCritique = fevrierData.noncritique;
  
      const marsData = await this.consommationCriticite(3);
      this.marsCritique = marsData.critique;
      this.marsNonCritique = marsData.noncritique;
  
      const avrilData = await this.consommationCriticite(4);
      this.avrilCritique = avrilData.critique;
      this.avrilNonCritique = avrilData.noncritique;
  
      const maiData = await this.consommationCriticite(5);
      this.maiCritique = maiData.critique;
      this.maiNonCritique = maiData.noncritique;
  
      const juinData = await this.consommationCriticite(6);
      this.juinCritique = juinData.critique;
      this.juinNonCritique = juinData.noncritique;
  
      this.initialData = [
        { name: 'critique', data: [this.janvierCritique, this.fevrierCritique, this.marsCritique, this.avrilCritique, this.maiCritique, this.juinCritique] },
        { name: 'non critique', data: [this.janvierNonCritique, this.fevrierNonCritique, this.marsNonCritique, this.avrilNonCritique, this.maiNonCritique, this.juinNonCritique] },
        { name: 'tous', data: [this.janvierCritique + this.janvierNonCritique, this.fevrierCritique + this.fevrierNonCritique, this.marsCritique + this.marsNonCritique, this.avrilCritique + this.avrilNonCritique, this.maiCritique + this.maiNonCritique, this.juinCritique + this.juinNonCritique] }
      ];
  }  
  

  consommationCriticite(mois: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.subscription = this.floorService.getHopitalConsommationCriticite(mois).subscribe(
        (consommation: any) => {
          resolve(consommation);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  updateData(message: any): void {
    if (message && typeof message.critique !== 'undefined' && typeof message.normal !== 'undefined') {
      const critiquejuin = message.critique;
      const normaljuin = message.normal;
      const tousjuin = critiquejuin + normaljuin;
      
      this.initialData = [
        { name: 'critique', data: [this.janvierCritique, this.fevrierCritique, this.marsCritique, this.avrilCritique, this.maiCritique, critiquejuin] },
        { name: 'non critique', data: [this.janvierNonCritique, this.fevrierNonCritique, this.marsNonCritique, this.avrilNonCritique, this.maiNonCritique, normaljuin] },
        { name: 'tous', data: [this.janvierCritique+this.janvierNonCritique,this.fevrierCritique+this.fevrierNonCritique,this.marsCritique+this.marsNonCritique,this.avrilCritique+this.avrilNonCritique,this.maiCritique+this.maiNonCritique,tousjuin] }, //  { name: 'tous', data: [11630468.045, 11630468.045, 11630468.045, 11630468.045, 11630468.045, 11630468.045] }
      ];

      this.renderChart(this.initialData);
    } else {
      console.error('Invalid data format:', message);
    }
  }

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

  filterData(): void {
    if (this.selectedOption === 'all') {
      this.filteredData = this.initialData;
    } else {
      this.filteredData = this.initialData.filter(item => item.name === this.selectedOption);
    }
    this.renderChart(this.filteredData);
  }
}
