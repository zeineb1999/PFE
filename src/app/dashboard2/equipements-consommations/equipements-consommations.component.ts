import { Component, ElementRef, Input, Renderer2, NgModule, OnDestroy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { FloorService } from 'src/app/service/floor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-equipements-consommations',
  templateUrl: './equipements-consommations.component.html',
  styleUrls: ['./equipements-consommations.component.css']
})
export class EquipementsConsommationsComponent implements OnChanges, OnDestroy {
  isLoggedIn: boolean;
  batiments: any[] = [];
  bgColorBatiments = ['orange-50', 'blue-50', 'orange-50', 'purple-50', 'pink-50'];
  chartsColorBatiments = ['#ffb253', '#2caffe', '#ffb253', '#934fff', '#da00d3'];
  titleColors = ['[#ffb253]', '[#2caffe]', '[#ffb253]', '[#934fff]', '[#da00d3]'];

  @Input() equipementsParLocal: any[] = [];
  subscriptions: Subscription = new Subscription();

  constructor(private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnChanges() {
    const batimentsSubscription = this.floorService.getAllBatiments().subscribe((batiments: any[]) => {
      this.batiments = batiments;

      batiments.forEach(batiment => {
        const etagesSubscription = this.floorService.getEtagesByBatiments(batiment.id).subscribe((etages: any[]) => {
          batiment.etages = etages;

          batiment.etages.forEach((etage: any) => {
            const locauxSubscription = this.floorService.getZonesForEtage(etage.id).subscribe((locaux: any[]) => {
              etage.locaux = locaux;
              let indiceExacteLocal = 1;
              etage.locaux.forEach((local: any) => {
                if (this.equipementsParLocal && this.equipementsParLocal[local.id]) {
                  local.equipements = this.equipementsParLocal[local.id];
                  local.equipements_names = [];
                  local.ConsData = [{ name: 'Les équipements dans le local ' + indiceExacteLocal, data: [] }];

                  local.equipements.forEach((equipement: any) => {
                    local.equipements_names.push(equipement.nom);
                    local.ConsData[0].data.push(equipement.consommation_kW);
                    if (local.equipements_names.length === local.equipements.length) {
                      this.renderChart(batiment.id, local);
                    }
                  });
                }
                indiceExacteLocal++;
              });
            });
            this.subscriptions.add(locauxSubscription);
          });
        });
        this.subscriptions.add(etagesSubscription);
      });
    });
    this.subscriptions.add(batimentsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  renderChart(bat_id: number, local: any) {
    let id = 'local-' + local.id;
    let localElement = this.renderer.createElement('div');
    this.renderer.setAttribute(localElement, 'id', id);
    this.renderer.setAttribute(localElement, 'style', 'min-width: 300px;');
    this.renderer.appendChild(this.el.nativeElement.querySelector('#etage' + local.etageZ + 'locals-container'), localElement);

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
        color: this.chartsColorBatiments[bat_id % 5]
      }]
    });
  }
}
