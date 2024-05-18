import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_networkgraph from 'highcharts/modules/networkgraph';
import { FloorService } from '../../service/floor.service';
import { forkJoin, of } from 'rxjs';
import { WebSocketService } from '../../service/web-socket.service';
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
  @Input() total: any;
  consommations_mois: any[] = [];
  constructor(private wsService: WebSocketService,private floorService: FloorService){ }
  ngOnInit() {/* 
    this.wsService.connectequipementSecond().subscribe(
      (message) => {
        console.log('Received message:', message);
        this.updateData(message);
       }
    ) */
   
    let consom:any [] = [{mois: 1, consommation: 16798943.227777813},
      {mois: 2, consommation: 15578770.548611129},
      {mois: 3, consommation: 16577564.177083328},
      {mois: 4, consommation: 16354767.313888894},
      {mois: 5, consommation: 14534320.397167528}
    ]
    this.insertChart(consom);
    //this.LoadEquipementsParMois()
    //console.log('Equipements:', this.equipements);
  }
  ngOnChanges() {
    console.log('total',this.total);
    this.updateData(this.total);
  }
  updateData(message: any): void {
    if (message && typeof message.critique !== 'undefined' && typeof message.normal !== 'undefined') {

      const tousjuin = message.critique + message.normal;

      this.consommations_mois =  [{mois: 1, consommation: 16798943.227777813},
        {mois: 2, consommation: 15578770.548611129},
        {mois: 3, consommation: 16577564.177083328},
        {mois: 4, consommation: 16354767.313888894},
        {mois: 5, consommation: tousjuin}
      ];
      this.insertChart(this.consommations_mois);
    } else {
      console.error('Invalid data format:', message);
    }
  }
  /* ngOnChanges() {
    //this.LoadEquipementsParMois()
    //console.log('Equipements:', this.equipements);
  } */

  LoadEquipementsParMois(){
    let derniers_jours_de_mois = ['31', '29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31']
    let mois = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    let mois2 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    let noms_mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septempbre', 'octobre', 'novembre', 'décembre']

    this.consommations_mois= []
    mois.forEach(this_mois => {
      if (parseInt(this_mois) <= new Date().getMonth() + 1) {
        console.log('mois: ',new Date().getMonth())
        let dateDebut = '2024-'+this_mois+'-01 00:00:00'
        let dateFin = '2024-'+this_mois+'-'+derniers_jours_de_mois[parseInt(this_mois)-1]+' 00:00:00'
        console.log('********************* ', dateDebut, ' -> ', dateFin)
        this.floorService.getHopitalConsommationPendantMois(dateDebut, dateFin)
        .subscribe((data: number) => {
          this.consommations_mois.push({ mois: parseInt(mois2[parseInt(this_mois) - 1]), consommation: data })
          console.log('consommations_mois', this.consommations_mois)
          console.log('rrrrrrrr', new Date().getMonth())
          if (this.consommations_mois.length == new Date().getMonth()+1) {
            // Trier la liste par mois
            this.consommations_mois.sort(this.comparerMois);
          //console.log(consommations_mois);
          this.insertChart(this.consommations_mois);
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