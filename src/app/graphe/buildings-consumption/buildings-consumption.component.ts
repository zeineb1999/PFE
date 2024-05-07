import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FloorService } from '../../service/floor.service';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-buildings-consumption',
  templateUrl: './buildings-consumption.component.html',
  styleUrls: ['./buildings-consumption.component.css']
})
export class BuildingsConsumptionComponent {
  constructor(private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {}
  selectedBuilding: any= {};
  buildingsLoading: boolean = true;
  floorsLoading: boolean = true;
  localsLoading: boolean = true;
  buildings: any[] = [];
  BatimentsChart: any;

  ngOnInit() {
  }
  
  ngAfterViewInit() {
    //this.buildingsPieChart()
    this.floorsPieChart()
  }
  
  /* buildingsPieChart() {

    let buildingsData: any[] = []
    this.buildingsLoading = true;
    this.floorService.getBatimentsConsommation().subscribe(
      (data: any[]) => {
        this.buildingsLoading = false;
        console.log('batiments: ', data)
        data.forEach(building => {
          let _name = 'batiment '+ building.id + ': ' + building.nomBatiment
          buildingsData.push({name: _name, y: building.consommation_totale_kW})

          this.chart = Highcharts.chart('batiments-pie-container', {
            chart: {
              type: 'pie'
            },
            title: {
              text: 'Browser market shares. January, 2022',
              align: 'left'
            },
            subtitle: {
              text: 'Click the slices to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
              align: 'left'
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
                events: {
                  click: function (event) {
                      console.log(this.name, ' point selected')
                  }
                }
              },
              series: {
                allowPointSelect: true,
                cursor: 'pointer',
                events: {
                    click: function (event) {
                        console.log(this.name, ' serie selected')
                    }
                }
            }
            },
            series: [{
              type: 'pie', 
              name: 'Batiments',
              data: buildingsData
            }]
          });
        });
      }
    );

  
  } */

  floorsPieChart() {

    let buildingsData: any[] = []
    let etagesChartData: any[] = []

    // Chargement des batiments:
    this.buildingsLoading = true;
    this.floorService.getBatimentsConsommation().subscribe(
      (data: any[]) => {
        this.buildingsLoading = false;
        let divElement: any;
        data.forEach(building => {
          // Créer le diagramme circulaire des batiments:
          let _name = 'batiment '+ building.id + ': ' + building.nomBatiment
          buildingsData.push({name: _name, y: building.consommation_totale_kW})

          // ************************************************************************************
          // ************************************************************************************
          // ************************************************************************************
          //essayer de déplacer en dehors de la boucle:
          this.BatimentsChart = Highcharts.chart('batiments-pie-container', {
            chart: {
              type: 'pie'
            },
            title: {
              text: 'Consommation dans les batiments',
              align: 'left'
            },
            subtitle: {
              text: 'aa',
              align: 'left'
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
                  format: '{point.name}: <b>{point.percentage:.1f} %</b>',
                  style: {
                    fontWeight: 'normal' 
                  },
                }
              },
              series: {
                allowPointSelect: true,
                cursor: 'pointer'
            }
            },
            series: [{
              type: 'pie', 
              colors: ['#9B5DE5', '#F15BB5', '#FEE440', '#00BBF9', '#00F5D4'],
              name: 'Batiments',
              data: buildingsData
            }]
          });

          // Créer un élément div pour chaque batiment avec un id pour insérer les diagramme de ses etages:
          let etageElementId: string;
          divElement = this.renderer.createElement('div')
          etageElementId = 'etage'+building.id
          this.renderer.setAttribute(divElement, 'id', etageElementId);
          this.renderer.setAttribute(divElement, 'style', 'width: 30%; height: 200px; margin-right: 3%');
          const parentElement = this.el.nativeElement.querySelector('#diagrammes-etages');
          if (parentElement) {
            this.renderer.appendChild(parentElement, divElement);
          }

          // Chargement des étages pour chaque batiment:    
          this.floorsLoading = true;
          let _categories: string[] = []
          let colors = ['#9B5DE5', '#F15BB5', '#FEE440', '#00BBF9', '#00F5D4']
          let i=0;
          this.floorService.getEtagesConsommation(building.id).subscribe((etagesData: any[]) => {
              this.floorsLoading = false;
              etagesChartData = [];

              etagesData.forEach(etage => {
                _categories = [];
                // Créer les données du diagramme:
                let _etageName = 'etage '+ etage.id 
                etagesChartData.push({name: _etageName, y: etage.consommation_totale_kW})
                _categories.push(_etageName)
              });

              Highcharts.chart(etageElementId, {
                chart: {
                  type: 'bar'
                },
                title: {
                  text: _name,
                  align: 'left',
                  style: {
                    fontSize: '12px'
                  }
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
                      text: null
                  },
                  gridLineWidth: 1,
                  lineWidth: 0
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '(Kw)',
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
                  color: 'blue',
                  name: 'Consommation par etage',
                  data: etagesChartData
                }]
              });
              i=i+1;
            }
          );
        });
      }
    );

    
    

  
  }

  LoadZones(){

    /* this.buildingsLoading = true;
    this.floorService.getOneZone(1).subscribe(
      (data: any) => {
        console.log(data);
      }
    )

    this.floorService.getZonesConsommation().subscribe(
        (data: any[]) => {
          this.buildingsLoading = false;
          this.buildings = data;
          console.log('zones: ', this.buildings)
        }
    );

    this.floorService.getEtagesConsommation().subscribe(
      (data: any[]) => {
        console.log('etages: ', data)
      }
    ); 

    this.floorService.getBatimentsConsommation().subscribe(
      (data: any[]) => {
        this.buildings = data;
        console.log('batiments: ', data)
      }
    );*/

  }

}