import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FloorService } from '../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
  selectedFilter: string = 'batiment';
  boolBatiment: boolean = false;
  boolEtage: boolean = false;
  boolZone: boolean = false;
  prediction: any;
  initialData: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private floorService: FloorService) {}

  ngOnInit(): void {
    this.boolBatiment = true;
    this.updatePredictions(3);
  }

  updatePredictions(nbrmois: number): void {
    const months: [number, number][] = this.getMonthsArray(nbrmois);
    this.loadPredictions(...months).then(predictions => {
      this.initialData = [
        { name: 'critique', data: predictions.map(p => p.predicted_consumption) },
        { name: 'non critique', data: predictions.map(p => p.predicted_consumption2) },
        { name: 'tous', data: predictions.map(p => (p.predicted_consumption + p.predicted_consumption2)) }
      ];
      this.renderChart(this.initialData, nbrmois);
    });
  }

  getMonthsArray(nbrmois: number): [number, number][] {
    const currentYear = new Date().getFullYear();
    const months: [number, number][] = [];
    for (let i = 0; i < nbrmois; i++) {
      const month = (7 + i) % 12 || 12;
      const year = month >= 7 ? currentYear : currentYear + 1;
      months.push([year, month]);
    }
    return months;
  }

  loadPredictions(...months: [number, number][]): Promise<any[]> {
    return Promise.all(months.map(([year, month]) => this.predict(year, month)));
  }

  predict(annee: number, mois: number): Promise<any> {
    const data = { year: annee, month: mois, filter: this.selectedFilter };
    return this.floorService.predictConsumptionMois(data).toPromise();
  }

  renderChart(data: any[], nbrmois: number): void {
    const categories = ['juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin'];
    const mois = { categories: categories.slice(0, nbrmois) };

    Highcharts.chart('container', {
      chart: { type: 'column' },
      title: { text: '' },
      xAxis: mois,
      yAxis: { title: { text: 'Consommation' } },
      series: data
    });
  }

  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedFilter = target.value;
    this.boolBatiment = this.selectedFilter === 'batiment';
    this.boolEtage = this.selectedFilter === 'etages';
    this.boolZone = this.selectedFilter === 'locaux';

    const nbrmois = this.boolBatiment ? 3 : this.boolEtage ? 6 : 12;
    this.updatePredictions(nbrmois);
  }


 /* predictOld(annee: number,mois: number): void {
    const data = {
      year: annee,
      month: mois,
      filter: this.selectedFilter // Pass the selected filter to the prediction function
    };

    this.floorService.predictConsumptionMois(data).subscribe(
      response => {
        this.prediction = response;
        console.log('Prediction cri:', response.predicted_consumption);
        console.log('Prediction nor:', response.predicted_consumption2);
        const predictionData = this.formatPredictionData(response.predicted_consumption);
        if (this.selectedFilter === 'batiment') {
          this.renderChart(predictionData, 3);
        } else if (this.selectedFilter === 'etages') {
          this.renderChart(predictionData, 6);
        } else if (this.selectedFilter === 'locaux') {
          this.renderChart(predictionData, 12);
        }
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

   formatPredictionData(predictedConsumption: any): any[] {
    return [
      { name: 'critique', data: predictedConsumption.critique },
      { name: 'non critique', data: predictedConsumption.nonCritique },
      { name: 'tous', data: predictedConsumption.tous }
    ];
  } */

  
}
