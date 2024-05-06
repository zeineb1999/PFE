import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_networkgraph from 'highcharts/modules/networkgraph';
import { FloorService } from '../../service/floor.service';
import { forkJoin, of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { waitForAsync } from '@angular/core/testing';

@Component({
  selector: 'app-consumption-evolution2',
  templateUrl: './consumption-evolution2.component.html',
  styleUrls: ['./consumption-evolution2.component.css']
})
export class ConsumptionEvolution2Component {

  Highcharts = Highcharts;
  chartOptions: any;
  constructor(private floorService: FloorService){ }
  ngOnInit() {
    this.LoadEquipementsParMois()
    //console.log('Equipements:', this.equipements);
  }
  ngOnChanges() {
    this.LoadEquipementsParMois()
    //console.log('Equipements:', this.equipements);
  }

  LoadEquipementsParMois(){
    let derniers_jours_de_mois = ['31', '29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31']
    let mois = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    let mois2 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    let noms_mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septempbre', 'octobre', 'novembre', 'décembre']

    let consommations_mois: any[] = []
    mois.forEach(this_mois => {
      if(parseInt(this_mois) <= new Date().getMonth()) {
        let dateDebut = '2024-'+this_mois+'-01 00:00:00'
        let dateFin = '2024-'+this_mois+'-'+derniers_jours_de_mois[parseInt(this_mois)-1]+' 00:00:00'
        console.log('********************* ', dateDebut, ' -> ', dateFin)
        this.floorService.getHopitalConsommationPendantMois(dateDebut, dateFin)
        .subscribe((data: number) =>{
          consommations_mois.push({mois: parseInt(mois2[parseInt(this_mois)-1]), consommation: data})
          console.log('rrrrrrrr', new Date().getMonth())
          if (consommations_mois.length == new Date().getMonth()) {
            // Trier la liste par mois
            consommations_mois.sort(this.comparerMois);
          //console.log(consommations_mois);
          this.insertChart(consommations_mois);
          }
        })
      }
    });
  }

  comparerMois(a: any, b: any) {
    return a.mois - b.mois;
  }

  insertChart(consommations_mois: any[]){
    this.chartOptions = {
      chart: {
          type: 'spline',
          zoomType: 'x'
      },
      title: {
          text: 'Evolution de la consommation totale de l\'hopital',
          align: 'left'
      },
      subtitle: {
          text: document.ontouchstart === undefined ?
              'Selectionner une partie pour appliquer un Zoon-in' : 'Pinch the chart to zoom in',
          align: 'left'
      },
      xAxis: {
          categories: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
      },
      yAxis: {
          title: {
              text: 'Consommation'
          }
      },
      legend: {
          enabled: false
      },
      plotOptions: {
          area: {
              fillColor: {
                  linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1
                  },
                  stops: [
                    [0, '#60efff'],
                    [1, '#0163ff2e']
                  ]
              },
              marker: {
                  radius: 2
              },
              lineWidth: 1,
              states: {
                  hover: {
                      lineWidth: 1
                  }
              },
              threshold: null
          },
          series: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
            }
        }
      },

      series: [{
          type: 'area',
          name: 'Evolution de la consommation totale de l\'hopital',
          data: consommations_mois.map(item => item.consommation)
      }]
    };
  }

}
