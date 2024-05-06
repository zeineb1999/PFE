import { Component, ElementRef, Renderer2, Input } from '@angular/core';
import { FloorService } from '../service/floor.service';
import { Router } from '@angular/router';

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
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component {

    isLoggedIn: boolean;
    equipements: any;
    equipementsParLocal: any;
    equipementsParEtage: any;
    equipementsParBatiment: any;

    EquipementsLoading: boolean= false;
    EquipementAChercher :string|undefined;

    dateDebut: string = '';
    heureDebut: string = '';
    dateFin: string = '';
    heureFin: string = '';
    @Input() local: string ='';
    @Input() type: string='';
    @Input() nowSlash: string='';
    AlerteId: any;
    roleUser: any;
    alertes: any[] = [];
    roleId: any;

    onAlertChange(local: string, temperature: number, nowSlash: string) {
      console.log(`Alert received: Local: ${local}, Temperature: ${temperature}, Now: ${nowSlash}`);
    }

    AlerteMessage: string = '';
    constructor(private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      this.roleUser=localStorage.getItem('role');
      this.roleId=localStorage.getItem('id');
    }

  ngOnInit() {

    this.floorService.get_alerte_non_notifie(this.roleId).subscribe((alertes: any) => {
      console.log('alertes: ', alertes)
      this.alertes = alertes

      alertes.forEach((alerte: any) => {
        this.AlerteId = alerte.id
        //console.log('local '+ alerte.localId+ ': ', alerte.nomLocal +' type: ',  alerte.type+' now: '+ alerte.nowSlash)
        this.AlerteMessage = alerte.text
        console.log('rrrrrrrrrr ', this.AlerteMessage)
        console.log('alerteM: ', alerte)
        alerte.notifie = true
        console.log('alerteM2: ', alerte)
        this.floorService.setAlerteNotifie(alerte.id, alerte).subscribe((alerteM: any) => {
          console.log('alerte apr modification: ', alerteM)
        });

        setTimeout(() => {
          this.AlerteMessage = '';

        }, 5000);


      });
    })
      this.LoadEquipements()
  }

    ngOnChanges() {
      this.LoadEquipements()
    }

    ngAfterViewInit() {
    }

    LoadEquipements(){
      this.EquipementsLoading = true;

      // Désactiver le boutton refresh :
      this.refreshButtonEnabled(false)

      if(this.dateDebut && !this.dateFin){  this.dateFinAlert() }

      else if (!this.dateDebut && this.dateFin) { this.dateDebutAlert() }

      else if(this.dateDebut && this.dateFin){

        let dateHeureDebut = this.dateDebut + ' 00:00:0'
        if(this.heureDebut)  { dateHeureDebut = this.dateDebut+' '+this.heureDebut+':0'}
        else { this.el.nativeElement.querySelector('#heureDebut').value = '00:00:00'}

        let dateHeureFin = this.dateFin + ' 00:00:0'
        if(this.heureFin) {dateHeureFin = this.dateFin+' '+this.heureFin+':0'}
        else { this.el.nativeElement.querySelector('#heureFin').value = '00:00:00' }

        if(new Date(this.dateDebut) >= new Date(this.dateFin)) {  this.invalidDatesAlert()  }

        else {  // dateDebut < dateFin
          this.hideAllAlerts()

          // Charger les équipements :
          this.floorService.getConsommationEquipementParPeriode(dateHeureDebut, dateHeureFin).subscribe(
            (data: any[]) => {
              this.EquipementsLoading = false;
              this.refreshButtonEnabled(true)   // Réactiver le boutton refresh:

              this.equipements = data;
              this.equipementsParLocal = this.RegrouperEquipementParLocal();
              this.equipementsParEtage = this.RegrouperEquipementParEtage();
              this.equipementsParBatiment = this.RegrouperEquipementParBatiment();
            },
            (error) => {
              console.error(error);
            }
          );
        }
      } else {  // (!this.dateDebut && !this.dateFin)
        this.hideAllAlerts()
        let now : Date = new Date()
        let isoDateString = new Date(now.getTime() + (60 * 60 * 1000)).toISOString();


        this.floorService.getConsommationEquipementParPeriode('2024-01-01 00:00:00', isoDateString.slice(0, 19).replace('T', ' ')).subscribe(
          (data: any[]) => {
            this.EquipementsLoading = false;
            this.refreshButtonEnabled(true)

            this.equipements = data;
            this.equipementsParLocal = this.RegrouperEquipementParLocal();
            this.equipementsParEtage = this.RegrouperEquipementParEtage();
            this.equipementsParBatiment = this.RegrouperEquipementParBatiment();
          }
        );
      }
    }

    alertHidden(obj: any){
      //console.log('rrr ', obj)
    }


    RegrouperEquipementParLocal(){
      // Regrouper les équipements par local
      const equipementsParLocal: { [key: number]: Equipement[] } = this.equipements.reduce((acc: { [x: string]: any[]; }, equipement: Equipement) => {
        const { localId } = equipement;

        // S'il n'existe pas, créez une nouvelle liste pour cet étage
        if (!acc[localId]) {
            acc[localId] = [];
        }
        acc[localId].push(equipement);
        return acc;
      }, {});
      return equipementsParLocal;
    }

    RegrouperEquipementParEtage(){
      // Regrouper les équipements par etage
      const equipementsParEtage: { [key: number]: Equipement[] } = this.equipements.reduce((acc: { [x: number]: any[]; }, equipement: Equipement) => {
        const { numEtage } = equipement;

        // S'il n'existe pas, créez une nouvelle liste pour cet étage
        if (!acc[numEtage]) {
            acc[numEtage] = [];
        }
        acc[numEtage].push(equipement);
        return acc;
      }, {});
      return equipementsParEtage;
    }

    RegrouperEquipementParBatiment(){
      // Regrouper les équipements par batiment
      const equipementsParBatiment: { [key: number]: Equipement[] } = this.equipements.reduce((acc: { [x: string]: any[]; }, equipement: Equipement) => {
        const { batimentId } = equipement;

        // S'il n'existe pas, créez une nouvelle liste pour cet étage
        if (!acc[batimentId]) {
            acc[batimentId] = [];
        }
        acc[batimentId].push(equipement);
        return acc;
      }, {});
      return equipementsParBatiment;
    }

    redirectToEquipementDetails(equipementId: number): void {
      this.router.navigate(['/equipement-details', equipementId]);
    }

    refreshButtonEnabled(enabled: Boolean){
      if(enabled){
        // Activer le boutton refresh :
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#refresh-icon'), 'class', 'fa-solid fa-rotate-right');
        this.el.nativeElement.querySelector('#refresh-button').disabled = false;
      } else {
        // Désactiver le boutton refresh :
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#refresh-icon'), 'class', 'fa-solid fa-rotate-right fa-spin');
        this.el.nativeElement.querySelector('#refresh-button').disabled = true;
      }
    }

    dateFinAlert(){
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dates-warning'), 'style', 'display: none');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut-missed'), 'style', 'display: none');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-missed'), 'style', 'display: flex');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut'), 'style', 'border: 1px solid transparent;');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureDebut'), 'style', 'border: 1px solid transparent;');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin'), 'style', 'border: 1px solid #c91c1c;');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureFin'), 'style', 'border: 1px solid #c91c1c;');
    }

    dateDebutAlert(){
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dates-warning'), 'style', 'display: none');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-missed'), 'style', 'display: none');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut-missed'), 'style', 'display: flex');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin'), 'style', 'border: 1px solid transparent;');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureFin'), 'style', 'border: 1px solid transparent;');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut'), 'style', 'border: 1px solid #c91c1c;');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureDebut'), 'style', 'border: 1px solid #c91c1c;');
    }

    invalidDatesAlert(){
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut-missed'), 'style', 'display: none');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-missed'), 'style', 'display: none');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dates-warning'), 'style', 'display: flex');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut'), 'style', 'border: 1px solid #c91c1c;');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureDebut'), 'style', 'border: 1px solid #c91c1c;');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin'), 'style', 'border: 1px solid #c91c1c;');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureFin'), 'style', 'border: 1px solid #c91c1c;');
    }

    hideAllAlerts(){
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dates-warning'), 'style', 'display: none');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut-missed'), 'style', 'display: none');
      this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-missed'), 'style', 'display: none');
    }

    handleAlerteChange(event: any) {

      console.log('j ai reçu alerte maint ? ', event.type)
      if (event.type == 'maintenance') {
        //console.log('local '+ event.localId+ ': ', event.nomLocal +' type: ',  event.type+' now: '+ event.nowSlash)
        this.AlerteMessage = 'Mr/Mme ' + event.userID + 'Local ' + event.localId + ' : ' + event.nomLocal + ' type : ' + event.type;
        console.log('rrrrrrrrrr ', this.AlerteMessage)

        setTimeout(() => {
          this.AlerteMessage = '';
        }, 5000);

      } else {
        //console.log('local '+ event.localId+ ': ', event.nomLocal +' type: ',  event.type+' now: '+ event.nowSlash)
        this.AlerteMessage = 'Local '+ event.localId + ' : '+ event.nomLocal+' enregistre une '+ event.type+ ' moyenne inhabituelle';
        console.log('rrrrrrrrrr ', this.AlerteMessage)
        setTimeout(() => {
          this.AlerteMessage = '';
          // Effacer le message après quelques secondes
            // Redirigez l'utilisateur vers la page de tableau de bord après la connexion réussie
        }, 5000);
      }
    }

    redirectToAlerteDetails(alerteId: number) {
      console.log('alerteId', alerteId)
      this.router.navigate(['/alerte-details/', alerteId]);
    }
    
    
}
