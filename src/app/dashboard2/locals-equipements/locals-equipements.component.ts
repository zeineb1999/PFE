import { Component, ElementRef, Input, Renderer2, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { FloorService } from 'src/app/service/floor.service';

@Component({
  selector: 'app-locals-equipements',
  templateUrl: './locals-equipements.component.html',
  styleUrls: ['./locals-equipements.component.css']
})
export class LocalsEquipementsComponent {
  isLoggedIn: boolean;
  batiments: any[] = [];
  //bgColorBatiments = ['pink-50', 'blue-50', 'pink-50', 'orange-50', 'purple-50']
  bgColorBatiments = ['orange-50', 'blue-50', 'orange-50', 'purple-50', 'pink-50']

  chartsColorBatiments = ['#ffb253', '#2caffe', '#ffb253', '#934fff', '#da00d3']
  //chartsColorBatiments = ['#da00d3', '#2caffe', '#934fff', '#ffb253', '#934fff']
  titleColors = ['[#ffb253]', '[#2caffe]', '[#ffb253]', '[#934fff]', '[#da00d3]']

  constructor(private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  }

  @Input() equipementsParLocal: any[] = [];

  ngOnChanges() {
    //console.log('equipementsParLocal : ', this.equipementsParLocal)

    this.floorService.getAllBatiments().subscribe((batiments: any[]) => {
      this.batiments = batiments

      batiments.forEach(batiment => {
        this.floorService.getEtagesByBatiments(batiment.id).subscribe((etages: any[]) => {
          batiment.etages = etages
          batiment.etages.forEach((etage: any) => {
            etage.locals_names = []
            etage.ConsData = []
            etage.ConsData[0] = {name: 'Les locaux dans l\'Ã©tage '+etage.id, data: []}

            this.floorService.getZonesForEtage(etage.id).subscribe((locaux: any[]) => {
              etage.locaux = locaux

              etage.locaux.forEach((local: any) => {
                //console.log('local', local)

                local.consommation_kW = 0
                if (this.equipementsParLocal && this.equipementsParLocal[local.id]) {
                  local.equipements = this.equipementsParLocal[local.id]

                  local.equipements.forEach((equipement: any) => {
                    let now : Date = new Date()
                    let isoDateString = new Date(now.getTime() + (60 * 60 * 1000)).toISOString();
                    local.consommation_kW = local.consommation_kW + equipement.consommation_kW

                  }); // fin equipement

                  etage.locals_names.push(local.nomLocal)
                  etage.ConsData[0].data.push(local.consommation_kW)
                  //console.log('etage.ConsData[0].data', etage.ConsData)
                }
                //console.log('etage.locals_names.length', etage.locals_names.length, '== etage.locaux.length', etage.locaux.length)
                if (etage.locals_names.length == etage.locaux.length) {

                  this.renderChart(batiment.id, etage)
                }

              }); // fin local

            })  // fin locaux

            //console.log('etage.ConsData',etage.ConsData )
            //etage.ConsData.data =


          }); // fin etage

        })  // fin etages
      }); // fin batiment
    })  // fin batiments
  }

  renderChart(bat_id: number, etage: any): void {
    //console.log('etage', etage)
    //console.log('names', locals_names)
    /* let whiteContainer = this.renderer.createElement('div')
    this.renderer.setAttribute(whiteContainer, 'class', 'p-4 rounded-sm shadow-sm bg-white border border-'+this.titleColors[bat_id%5]);
    this.renderer.appendChild(this.el.nativeElement.querySelector('#charts-container' + bat_id), whiteContainer);

    let labelElement = this.renderer.createElement('div')
    this.renderer.setAttribute(labelElement, 'id', 'label-etage-' + etage.id);
    this.renderer.setAttribute(labelElement, 'class', 'w-full m-2 text-center font-medium text-'+this.titleColors[bat_id%5]);
    labelElement.innerHTML='Etage '+etage.id+': '+etage.nomEtage
    this.renderer.appendChild(whiteContainer, labelElement);

    let etageElement = this.renderer.createElement('div')
    this.renderer.setAttribute(etageElement, 'id', 'etage-'+etage.id);
    this.renderer.setAttribute(etageElement, 'style', 'width: 300px; ');
    this.renderer.appendChild(whiteContainer, etageElement); */


    Highcharts.chart('etage-'+etage.id, {
      chart: {
        type: 'column',
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: etage.locals_names
      },
      yAxis: {
        title: {
          text: 'Consommation'
        }
      },
      series: [{
        type: 'column',
        name: etage.ConsData[0].name,
        data: etage.ConsData[0].data,
        color: this.chartsColorBatiments[bat_id%5]
      }]
    });
  }
}