import { Component, ElementRef, Input, Renderer2, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { FloorService } from 'src/app/service/floor.service';

@Component({
  selector: 'app-categories-equipements',
  templateUrl: './categories-equipements.component.html',
  styleUrls: ['./categories-equipements.component.css']
})
export class CategoriesEquipementsComponent {

  @Input() equipementsParCategorie: any;
  @Input() equipementsParCriticite: any;
  isLoggedIn: boolean;
  typesData: any[] = []
  criticiteData: any[] = []

  constructor(private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnChanges() {
    if (this.equipementsParCategorie) {
      this.typesData = []; // Réinitialiser les données
      this.getEquipementstypes().forEach(type => {
        let cons = 0;
        this.equipementsParCategorie[type].forEach((equipement: any) => {
          cons += equipement.consommation_kW;
        });
        this.typesData.push({ name: type, y: cons });
      });
      if (this.getEquipementstypes().length === this.typesData.length) {
        this.insertPie();
      }
    }
    if (this.equipementsParCriticite) {
      console.log('/// this.equipementsParCriticite', this.equipementsParCriticite)
      let cons2=0
      this.equipementsParCriticite['critique'].forEach((equipement: any) => {
        cons2 += equipement.consommation_kW;
      });
      this.criticiteData.push({ name: 'Equipements critiques', y: cons2 });

      let cons3=0
      this.equipementsParCriticite['normal'].forEach((equipement: any) => {
        cons3 += equipement.consommation_kW;
      });
      this.criticiteData.push({ name: 'Equipements non critiques', y: cons3 });
    }
    if (this.criticiteData.length == 2) {
      this.insertPie2();
    }
    
  }

  getEquipementstypes() {
    return Object.keys(this.equipementsParCategorie);
  }

  getEquipementsCriticite() {
    return Object.keys(this.equipementsParCategorie);
  }


  insertPie() {
    Highcharts.chart('pie-container', {
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
        }
    },
      series: [{
        type: 'pie',
        //colors: ['#ffb253', '#2caffe', '#ffb253', '#934fff', '#da00d3'],
        name: 'Batiments',
        data: this.typesData,
      }]
    });
  }

  insertPie2() {
    Highcharts.chart('pie-container2', {
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
        }
    },
      series: [{
        type: 'pie',
        colors: ['#ffb253', '#2caffe', '#ffb253', '#934fff', '#da00d3'],
        name: 'Batiments',
        data: this.criticiteData
      }]
    });
  }
}