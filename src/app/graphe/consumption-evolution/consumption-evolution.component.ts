import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_networkgraph from 'highcharts/modules/networkgraph';
import { FloorService } from '../../service/floor.service';
import { forkJoin, of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { waitForAsync } from '@angular/core/testing';

interface Local {
  id: number;
  nomLocal: string;
  typeLocal: string;
  etageZ: number;
  surface: any;
}

interface surfaceData {
  name: string;
  y: any;
}

@Component({
  selector: 'app-consumption-evolution',
  templateUrl: './consumption-evolution.component.html',
  styleUrls: ['./consumption-evolution.component.css']
})
export class ConsumptionEvolutionComponent {

    Highcharts = Highcharts;
    chartOptions: any;
    isLoggedIn: boolean;
  
    constructor(private floorService: FloorService) {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }
  
    ngOnInit() {
      //console.log('ngOnInit called');
      this.chartOptions = {
        chart: {
          type: 'area'
        },
        title: {
          text: 'Random DATA'
        },
        subtitle: {
          text: 'Demo'
        },
        tooltip: {
          split: true,
          valueSuffix: ' millions'
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: true,
        },
        series: [{
          name: 'Ocean transport',
          data: [13234, 12729, 11533, 17798, 10398, 12811, 15483, 16196, 16214]
        }, {
          name: 'Households',
          data: [6685, 6535, 6389, 6384, 6251, 5725, 5631, 5047, 5039]
  
        }, {
          name: 'Agriculture and hunting',
          data: [4752, 4820, 4877, 4925, 5006, 4976, 4946, 4911, 4913]
        }, {
          name: 'Air transport',
          data: [3164, 3541, 3898, 4115, 3388, 3569, 3887, 4593, 1550]
  
        }, {
          name: 'Construction',
          data: [2019, 2189, 2150, 2217, 2175, 2257, 2344, 2176, 2186]
        }]
      };
    }


}
