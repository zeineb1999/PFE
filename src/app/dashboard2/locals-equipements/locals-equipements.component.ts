import { Component, ElementRef, Input, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { FloorService } from 'src/app/service/floor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-locals-equipements',
  templateUrl: './locals-equipements.component.html',
  styleUrls: ['./locals-equipements.component.css']
})
export class LocalsEquipementsComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean;
  batiments: any[] = [];
  bgColorBatiments = ['orange-50', 'blue-50', 'orange-50', 'purple-50', 'pink-50'];
  chartsColorBatiments = ['#ffb253', '#2caffe', '#ffb253', '#934fff', '#da00d3'];
  titleColors = ['[#ffb253]', '[#2caffe]', '[#ffb253]', '[#934fff]', '[#da00d3]'];

  private subscriptions: Subscription = new Subscription();

  @Input() equipementsParLocal: any[] = [];

  constructor(private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnInit(): void {
    this.loadBatiments();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges() {
    this.loadBatiments();
  }

  private loadBatiments(): void {
    const batimentsSubscription = this.floorService.getAllBatiments().subscribe((batiments: any[]) => {
      this.batiments = batiments;

      batiments.forEach(batiment => {
        const etagesSubscription = this.floorService.getEtagesByBatiments(batiment.id).subscribe((etages: any[]) => {
          batiment.etages = etages;
          let indiceExacteLocal = 1;
          batiment.etages.forEach((etage: any) => {
            etage.locals_names = [];
            etage.ConsData = [];
            etage.ConsData[0] = { name: 'Les locaux dans l\'étage ' + indiceExacteLocal, data: [] };

            const locauxSubscription = this.floorService.getZonesForEtage(etage.id).subscribe((locaux: any[]) => {
              etage.locaux = locaux;

              etage.locaux.forEach((local: any) => {
                local.consommation_kW = 0;
                if (this.equipementsParLocal && this.equipementsParLocal[local.id]) {
                  local.equipements = this.equipementsParLocal[local.id];

                  local.equipements.forEach((equipement: any) => {
                    local.consommation_kW += equipement.consommation_kW;
                  });

                  etage.locals_names.push(local.nomLocal);
                  etage.ConsData[0].data.push(local.consommation_kW);
                }

                if (etage.locals_names.length == etage.locaux.length) {
                  this.renderChart(batiment.id, etage);
                }
              });
            });
            this.subscriptions.add(locauxSubscription);

            indiceExacteLocal++;
          });
        });
        this.subscriptions.add(etagesSubscription);
      });
    });
    this.subscriptions.add(batimentsSubscription);
  }

  private renderChart(bat_id: number, etage: any): void {
    Highcharts.chart('etage-' + etage.id, {
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
        color: this.chartsColorBatiments[bat_id % 5]
      }]
    });
  }
}
