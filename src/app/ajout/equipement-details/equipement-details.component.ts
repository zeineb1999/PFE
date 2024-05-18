import { AuthService } from './../../service/auth.service';


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FloorService } from 'src/app/service/floor.service';
import * as Highcharts from 'highcharts';

interface Equipement {
    id: number;
    nom: string;
    etat: string;
    categorie: string;

    puissance: number;
    maxConsommation: number;
    minConsommation: number;
    zoneId: number;
  }

@Component({
  selector: 'app-equipement-details',
  templateUrl: './equipement-details.component.html',
  styleUrls: ['./equipement-details.component.css']
})
export class EquipementDetailsComponent implements OnInit {

  equipementId!: number;
  equipementDetails: Equipement | undefined;

  isLoggedIn: boolean;
  chartOptions: any;
  Highcharts = Highcharts;
  consommation_annuelle_totale: number = 0;
  equipementInfos: any;
  rapports: any[] = [];
  alertes: any[] = [];
  typeFilter: string = '';
  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private floorService: FloorService) {  this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; }

  ngOnInit(): void {
    this.loadDetails();
    this.LoadEquipementsParMois();
    this.loadAlertes();
  }

  loadDetails (){
    // Récupérer le paramètre zoneId de l'URL
    this.equipementId = parseInt(this.route.snapshot.paramMap.get('equipementId') || '');

    // Appeler le service pour récupérer les détails de la zone
    this.floorService.getEquipementDetails(this.equipementId).subscribe(
      (data: Equipement) => {
        this.equipementDetails = data;
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des détails de la zone :', error);
      }
    );
  }

  loadAlertes() {
    this.alertes = []
    this.equipementId = parseInt(this.route.snapshot.paramMap.get('equipementId') || '');

    this.floorService.getRapportsByEquipementId(this.equipementId).subscribe(Response => {
      this.rapports = Response;
      console.log('--------------------------------rapports', this.rapports)
      Response.forEach((rapport: any) => {
        this.floorService.getAlerte(rapport.alerte).subscribe((alerte: any) => {
          console.log('cond: ', (alerte.type == this.typeFilter || this.typeFilter == ''),'al: ', alerte.type,'f ',  this.typeFilter)
          if (alerte.type == this.typeFilter || this.typeFilter == '') {
            alerte.dateAlerte = alerte.dateAlerte.split('T')[0].split('-')[2]+'/'+ alerte.dateAlerte.split('T')[0].split('-')[1] + '/' + alerte.dateAlerte.split('T')[0].split('-')[0] + ' '+ alerte.dateAlerte.split('T')[1].split(':')[0] + ':'+alerte.dateAlerte.split('T')[1].split(':')[1]
            console.log(alerte)

            this.authService.getAllusers().subscribe((users: any[]) => {
              console.log(users)
              alerte.user = users.find(user => user.id === alerte.userID);
            })

            this.floorService.getRapportsByAlerteId(alerte.id).subscribe((rapports: any[]) => {
              alerte.rapport = rapport;
              console.log('alerte; ',alerte)
              this.alertes.push(alerte)
            })
          }
        })
      });
    })



  }

  LoadEquipementsParMois(){

    let derniers_jours_de_mois = ['31', '29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31']
    let mois = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    let mois2 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    let noms_mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septempbre', 'octobre', 'novembre', 'décembre']

    let consommations_mois: any[] = []
    this.consommation_annuelle_totale = 0;
    mois.forEach(this_mois => {
      if(parseInt(this_mois) <= new Date().getMonth() + 1){
        let dateDebut = '2024-'+this_mois+'-01 00:00:00'
        let dateFin = '2024-'+this_mois+'-'+derniers_jours_de_mois[parseInt(this_mois)-1]+' 00:00:00'
        this.floorService.getAnEquipementConsommation(this.equipementId, dateDebut, dateFin)
        .subscribe((data: any) =>{
          this.equipementInfos = data;
          //console.log(noms_mois[parseInt(this_mois)-1], ' equipementInfos : ', data)
          consommations_mois.push({nom: noms_mois[parseInt(this_mois)-1], y: data.consommation_kW})
          //console.log('consommations_mois: ', consommations_mois)
          this.consommation_annuelle_totale += data.consommation_kW;

          if(consommations_mois.length == new Date().getMonth() + 1){
            // Trier la liste par mois
            consommations_mois.sort(this.comparerMois);
            this.insertChart(consommations_mois, noms_mois, this.consommation_annuelle_totale)
          }
        });
      }
    });
  }

  comparerMois(a: any, b: any) {
    return a.mois - b.mois;
  }

  insertChart(consommations_mois: any[], noms_mois: any[], consommation_annuelle_totale: any){
    let i = -1;
    let newTab : any[] =[]
    let month_data: any

    // Trier les donnes par mois
    let diff : number [] = [];
    let prec : number = 0;
    let j = 0;
    while(newTab.length < new Date().getMonth() + 1) {
      month_data = consommations_mois.find(mois => mois.nom === noms_mois[j]);
      //console.log('moissssss: ', month_data)
      if(prec==0 || j==0){
        diff.push(0)
      } else {
        diff.push((month_data.y - prec)*100 / prec)
      }
      newTab.push(month_data)
      prec = month_data.y
      j++;
    }

    if(newTab.length == new Date().getMonth() + 1){
      Highcharts.chart('columns-container', {
        data: {
          table: 'datatable'
        },
        chart: {
            type: 'column'
        },
        title: {
            text: '<span class="font-medium">Consommation annuelle de l\'énergie électrique de : </span> <b>'+(this.equipementDetails ? this.equipementDetails.nom : '')+'</b> en kWh'
        },
        subtitle: {
          text: ''
        },
        xAxis: {
            type: 'category',
            categories: noms_mois,
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Electricité consommée (kWh)'
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
              formatter: (function() {

                return function() {
                  //console.log('this : ', this.y?.toFixed(2))
                  if (this.y) {
                    i++; // Incrémenter i à chaque fois que la fonction est appelée
                    if(diff[i]){
                      if (diff[i] < 0) {
                        return '<div class="mr-2">' + this.y.toFixed(2) + '</div><div class="text-xs" style="color: red; font-size: 0.6rem;"> ' + diff[i].toFixed(1) + '% </div>';
                      } else {
                        return '<div class="mr-2">' + this.y.toFixed(2) + '</div><div class="text-xs" style="color: green; font-size: 0.6rem;"> +' + diff[i].toFixed(1) + '% </div>';
                      }
                    } else if (diff[i] == 0) {
                      return '<div class="mr-2">' + this.y.toFixed(1) + '</div>';
                    }

                  } else if(this.y == 0){
                    i++; // Incrémenter i à chaque fois que la fonction est appelée
                    if(diff[i]){
                      if (diff[i] < 0) {
                        return '<div class="mr-2">0 </div><div class="text-xs" style="color: red; font-size: 0.6rem;"> ' + diff[i] + '% </div>';
                      } else if (diff[i] == 0) {
                        return '<div class="mr-2">0 </div>';
                      } else {
                        return '<div class="mr-2">0 </div><div class="text-xs" style="color: green; font-size: 0.6rem;"> +' + diff[i] + '% </div>';
                      }
                    }
                  }
                  return 0;
                };
              })()
            },
            point: {
              events: {
                mouseOver: function() {
                  let afficheur= document.getElementById('afficheur-consommation')
                  if(afficheur){
                    //console.log(this.category)
                    afficheur.innerHTML = '<div class="text-5xl text-gray-200 text-bold py-2 cons-totale-titre  flex justify-center"  *ngIf="equipementDetails">'+this.category+'</div>'+
                    '<div class="text-5xl text-gray-200 py-4 cons-totale-val  flex justify-center">'+this.y?.toFixed(2)+' kWh</div>'+
                    '<style>'+
                    '.cons-totale {flex-direction: column;border: 2px #edf5f9 solid;border-radius: 10%;background-color: #edf5f9;}'+
                    '.cons-totale-titre {color: #424b5b;font-weight: bolder;font-size: large; width: 100%;}'+
                    '.cons-totale-val {color: #2caffe;font-weight: bolder;font-size: xx-large;width: 100%;}'+
                    '</style>'
                  }
                },
                mouseOut: function() {
                  let afficheur= document.getElementById('afficheur-consommation')
                  if(afficheur){
                    //console.log(this.category)
                    afficheur.innerHTML = '<div class="text-5xl text-gray-200 text-bold py-2 cons-totale-titre  flex justify-center"  *ngIf="equipementDetails">Total</div>'+
                    '<div class="text-5xl text-gray-200 py-4 cons-totale-val  flex justify-center">'+consommation_annuelle_totale?.toFixed(2)+' kWh</div>'+
                    '<style>'+
                    '.cons-totale {flex-direction: column;border: 2px #edf5f9 solid;border-radius: 10%;background-color: #edf5f9;}'+
                    '.cons-totale-titre {color: #424b5b;font-weight: bolder;font-size: large;width: 100%;}'+
                    '.cons-totale-val {color: #2caffe;font-weight: bolder;font-size: xx-large; width: 100%;}'+
                    '</style>'
                  }
                }
              }
          }
        }
        },
        series: [{
          type: 'column',
          name: '<span class="font-medium">Consommation annuelle de l\'énergie électrique de : </span> <b>'+(this.equipementDetails ? this.equipementDetails.nom : '')+'</b> en kWh',
          color: '',
          data: newTab
        }]
      });
    }

  }

  redirectToModifierEquipement(){
    this.router.navigate(['/updateEquipement', this.equipementId]);
  }
  redirectToRapportDetails(id: number) {

  }

  addTypeFilter(type: string) {
    this.typeFilter = type;
    this.loadAlertes()
  }
}