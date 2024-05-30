import { Component, ElementRef, Input, Renderer2, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { FloorService } from 'src/app/service/floor.service';

@Component({
  selector: 'app-equipements-consommations',
  templateUrl: './equipements-consommations.component.html',
  styleUrls: ['./equipements-consommations.component.css']
})
export class EquipementsConsommationsComponent {
  isLoggedIn: boolean;
  batiments: any[] = [];
  bgColorBatiments = ['orange-50', 'blue-50', 'orange-50', 'purple-50', 'pink-50']

  chartsColorBatiments = ['#ffb253', '#2caffe', '#ffb253', '#934fff', '#da00d3']
  //chartsColorBatiments = ['#da00d3', '#2caffe', '#934fff', '#ffb253', '#934fff']
  titleColors = ['[#ffb253]', '[#2caffe]', '[#ffb253]', '[#934fff]', '[#da00d3]']

  @Input() equipementsParLocal: any[] = [];

  constructor(private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnChanges() {
    
    this.floorService.getAllBatiments().subscribe((batiments: any[]) => {
      this.batiments = batiments

      batiments.forEach(batiment => {

        this.floorService.getEtagesByBatiments(batiment.id).subscribe((etages: any[]) => {
          batiment.etages = etages

          batiment.etages.forEach((etage: any) => {
            
            this.floorService.getZonesForEtage(etage.id).subscribe((locaux: any[]) => {
              etage.locaux = locaux
              //console.log('etage', etage)
              
              etage.locaux.forEach((local: any) => {

                if (this.equipementsParLocal && this.equipementsParLocal[local.id]) {
                  local.equipements = this.equipementsParLocal[local.id]
                  local.equipements_names = []
                  local.ConsData = [{ name: 'Les équipements dans le local ' + local.id, data: [] }]
                  
                  local.equipements.forEach((equipement: any) => {
                    let now : Date = new Date()
                    let isoDateString = new Date(now.getTime() + (60 * 60 * 1000)).toISOString();
                    local.equipements_names.push(equipement.nom)
                    local.ConsData[0].data.push(equipement.consommation_kW)
                    
                    //console.log('local.equipements_names.length', local.equipements_names.length, '== local.equipements.length', local.equipements.length)
                    if (local.equipements_names.length == local.equipements.length) {
                      this.renderChart(batiment.id, local)
                    }
                  }); // fin equipement
                }

              }); // fin local
            })
          })
        })
      })
    })
  }

  renderChart(bat_id: number, local: any) {
    let id = 'local-' + local.id
    console.log('local : ', local)

    let localElement = this.renderer.createElement('div')
    this.renderer.setAttribute(localElement, 'id', id);
    this.renderer.setAttribute(localElement, 'style', 'min-width: 300px; ');
    this.renderer.appendChild(this.el.nativeElement.querySelector('#etage'+local.etageZ+'locals-container'), localElement);
    
    
    Highcharts.chart(id, {
      chart: {
        type: 'column',
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: local.equipements_names
      },
      yAxis: {
        title: {
          text: 'Consommation'
        }
      },
      series: [{
        type: 'column',
        name: local.ConsData[0].name,
        data: local.ConsData[0].data,
        color: this.chartsColorBatiments[bat_id%5]
      }]
    });
  }
}