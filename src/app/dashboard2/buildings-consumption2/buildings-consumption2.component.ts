import { Component, ElementRef, Renderer2, Input , OnDestroy} from '@angular/core';
import { FloorService } from '../../service/floor.service';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { Subscription } from 'rxjs';
interface Equipement {
  id: number;
  nom: string;
  etat: string;
  localId: number;
  nomLocal: string;
  typeLocal: string;
  numEtage: number;
  nomEtage: string;
  batimentId: number;
  batiment: string;
  consommation_W: number;
  consommation_kW: number;
}

@Component({
  selector: 'app-buildings-consumption2',
  templateUrl: './buildings-consumption2.component.html',
  styleUrls: ['./buildings-consumption2.component.css']
})
export class BuildingsConsumption2Component {

  constructor(private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {}

  @Input() equipementsParBatiment: any[] = [];
  private subscription: Subscription = new Subscription();
  ngOnInit() {
    let m = [{ name: 'aa', y: 123 }, { name: 'aa', y: 125 }, { name: 'aa', y: 734 }, { name: 'aa', y: 524 }]
    this.insertBuildingsPieChart(m)
  }
  ngOnChanges() {
    this.LoadData()
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  buildingsLoading: boolean = true;
  floorsLoading: boolean = true;
  localsLoading: boolean = true;
  buildings: any[] = [];
  BatimentsChart: any;

  LoadData() {

    this.disignInit()

    this.buildingsLoading = true;
    this.floorsLoading = true;

    if(this.equipementsParBatiment){

      if(this.equipementsParBatiment.length == 0) {
        this.buildingsLoading = true;
        this.floorsLoading = true;
      } else {
        this.buildingsLoading = false;
        this.floorsLoading = false;

        let buildingsData: any[] = []
        let etagesChartData: any[] = []

        // Charger la consommation dans chaque batiment
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#batiments-container'), 'class', '');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#batiments-pie-container'), 'style', 'display: flex; overflow: hidden; height: 300px;');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#diagrammes-etages'), 'style', 'min-height: 400px; width: 100%; display: flex; flex-wrap: wrap; justify-content: flex-start;');

        let divElement: any;
        const parentElement = this.el.nativeElement.querySelector('#diagrammes-etages');

        let colorIndex = 0;
        let indiceExacte =1;

        for (const i in this.equipementsParBatiment)  {
          ////console.log("&&&&&&&&&&&&&&&&&&&&&&&&777  i",i)
          let _name = 'batiment '+ indiceExacte+ ': ' + this.equipementsParBatiment[i][0].batiment
          let consommationBatiment = 0;
          this.equipementsParBatiment[i].forEach((equipement: Equipement) => {
            consommationBatiment += equipement.consommation_kW
          });
          
          // Préparer les données du diagramme des batiments:
          buildingsData.push({name: _name, y: consommationBatiment})
          //buildingsData.push({name: _name, y: 10})

          // Créer un élément div pour insérer les diagramme des etages:
          let etageElementId: string;
          divElement = this.renderer.createElement('div')
          etageElementId = 'batiment-' + indiceExacte
          this.renderer.setAttribute(divElement, 'id', etageElementId);
          this.renderer.setAttribute(divElement, 'class', 'diagramme-batiment');
          this.renderer.setAttribute(divElement, 'style', 'width: 50%; height: 200px; ');
          this.renderer.appendChild(parentElement, divElement);

          // Regrouper les équipements par etage

          const equipementsParEtage: { [key: number]: Equipement[] } = this.equipementsParBatiment[i].reduce((acc: { [key: number]: Equipement[]}, equipement: Equipement) => {
            const { numEtage } = equipement;

            // S'il n'existe pas, créez une nouvelle liste pour cet étage
            if (!acc[numEtage]) {
                acc[numEtage] = [];
            }
            acc[numEtage].push(equipement);
            return acc;
          }, {});

          let _categories: string[] = []
          etagesChartData = []
          let indiceExacteEtage = 1
          for (const j in equipementsParEtage) {
            let _etageNum = 'etage '+ indiceExacteEtage
            let _etageName = _etageNum + ': '+ equipementsParEtage[j][0].nomEtage
            let consommation = 0;
            equipementsParEtage[j].forEach(equipement => {
              consommation += equipement.consommation_kW
            });
            etagesChartData.push({name: _etageName, y: consommation})
            //etagesChartData.push({name: _etageName, y: 10})
            _categories.push(_etageNum)
            indiceExacteEtage++;
          }
          this.insertFloorChart(etageElementId, _name, _categories, etagesChartData, colorIndex)
          colorIndex++;
          indiceExacte++;
        }

        this.insertBuildingsPieChart(buildingsData)
      }

    } else {
      this.buildingsLoading = true;
      this.floorsLoading = true;
    }



  }


  disignInit(){
    this.renderer.setAttribute(this.el.nativeElement.querySelector('#batiments-pie-container'), 'style', 'display: none');
    this.renderer.setAttribute(this.el.nativeElement.querySelector('#batiments-container'), 'class', 'flex justify-center items-center');
    this.renderer.setAttribute(this.el.nativeElement.querySelector('#batiments-container'), 'class', 'flex justify-center items-center');
    this.el.nativeElement.querySelector('#diagrammes-etages').innerHTML = ''
    this.renderer.setAttribute(this.el.nativeElement.querySelector('#diagrammes-etages'), 'style', 'width: 0;');
  }


  insertFloorChart(etageElementId: string, _name: string, _categories: string[], etagesChartData: any[], colorIndex:number){

    let colors = ['#00bbf9', '#00f5d4', '#fee440', '#9b5de5', '#f15bb5', '#219ebc', '#ff006e']
    ////console.log('col: ',colorIndex)
    Highcharts.chart(etageElementId, {
      chart: {
        type: 'bar'
      },
      title: {
        text: _name,
        align: 'left',
        style: {
          fontSize: '12px',
          fontWeight: 'bold'
        }
      },
      credits: {
        enabled: false
      },
      subtitle: {
        text: '',
        align: 'left'
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: _categories,
        title: {
            text: null,
            style: {
              fontWeight: 'bold'
            },
        },
        gridLineWidth: 1,
        lineWidth: 0
      },
      yAxis: {
          min: 0,
          title: {
              text: 'électricité(kWh)',
              align: 'high'
          },
          gridLineWidth: 0
      },
      accessibility: {
        announceNewData: {
          enabled: true
        },
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          },
        },
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            formatter: function() {
              if(this.y){return this.y.toFixed(2);}
              return 0;
            }
          }
      }
      },
      series: [{
        type: 'bar',
        color: colors[colorIndex],
        name: 'Consommation par etage',
        data: etagesChartData
      }]
    });
  }

  insertBuildingsPieChart(buildingsData: any[]) {
    this.BatimentsChart = Highcharts.chart('batiments-pie-container', {
      chart: {
        type: 'pie'
      },
      title: {
        text: '',
        align: 'left'
      },
      credits: {
        enabled: false
      },
      /* subtitle: {
        text: '',
        align: 'left'
      }, */
      accessibility: {
        announceNewData: {
          enabled: true
        },
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}: <b>{point.percentage:.1f} %</b>',
            style: {
              fontWeight: 'normal'
            },
          }
        },
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          point: {
            events: {
              mouseOver: function() {
                const diagrammes = document.getElementsByClassName('diagramme-batiment')
                if(diagrammes){
                  Array.from(diagrammes).forEach(diagramme => {
                    if(diagramme.id != this.name.split(':')[0].replace(' ', '-')){
                      diagramme.setAttribute('style', 'width: 50%; height: 200px;  opacity: 10%; transition: opacity 300ms;')
                    }
                  });
                }
              },
              mouseOut: function() {
                const diagrammes = document.getElementsByClassName('diagramme-batiment')
                if(diagrammes){
                  Array.from(diagrammes).forEach(diagramme => {
                    if(diagramme.id != this.name.split(':')[0].replace(' ', '-')){
                      diagramme.setAttribute('style', 'width: 50%; height: 200px;  opacity: 100%; transition: opacity 300ms;')
                    }
                  });
                }
              }
            }
        }
      }
    },
      series: [{
        type: 'pie',
        colors: ['#00bbf9', '#00f5d4','#fee440', '#9b5de5', '#f15bb5', '#219ebc', '#ff006e'],
        name: 'Batiments',
        data: buildingsData
      }]
    });
  }

}