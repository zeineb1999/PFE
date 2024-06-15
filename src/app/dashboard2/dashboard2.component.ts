
    import { Component, ElementRef, Renderer2, Input, OnDestroy } from '@angular/core';
    import { FloorService } from '../service/floor.service';
    import { Router } from '@angular/router';
    import { Subscription } from 'rxjs';
    import { WebSocketService } from 'src/app/service/web-socket.service';
    
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
      private equipementsSubscription: Subscription | undefined;
      private intervalId: any;
      isLoggedIn: boolean;
      equipements: any;
      equipementsParLocal: any;
      equipementsParEtage: any;
      equipementsParBatiment: any;
      equipementsParCategorie: any;
      equipementsParCriticite: any;
      errorDate: boolean = false;
      Consommation_totale:number=0;
      
      EquipementsLoading: boolean= false;
      EquipementAChercher :string|undefined;
    
      dateDebut: string = '';
      heureDebut: string = '';
      dateFin: string = '';
      heureFin: string = '';
      @Input() local: string ='';
      @Input() type: string='';
      @Input() nowSlash: string='';
      zmer : any;
      AlerteId: any;
      roleUser: any;
      alertes: any[] = [];
      roleId: any;
      sendData: any;
      batiments: any[]=[];
      locaux: any[]=[];
      alertesTotal:any[]=[];

    
      onAlertChange(local: string, temperature: number, nowSlash: string) {
        //console.log(`Alert received: Local: ${local}, Temperature: ${temperature}, Now: ${nowSlash}`);
      }
    
      AlerteMessage: string = '';
      constructor(private wsService: WebSocketService,private floorService: FloorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
        this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        this.roleUser=sessionStorage.getItem('role');
        this.roleId=sessionStorage.getItem('id');
      }
    
      ngOnInit() {
        this.floorService.getAllBatiments().subscribe((batiments: any[]) => {
          this.batiments = batiments
        })
    
        this.floorService.getAllZones().subscribe((locaux: any[]) => {
          this.locaux = locaux
        })
        
        this.floorService.getAllAlertes().subscribe((alertes:any[]) => {
          this.alertesTotal= alertes
        })
        this.LoadEquipements()
          this.floorService.getHopitalConsommationPendantMoisCritiqueETNormal().subscribe((data: any) => {
          this.sendData = data;
          //console.log('sendData: ', this.sendData);
        });
    
        this.intervalId = setInterval(() => {
          this.floorService.getHopitalConsommationPendantMoisCritiqueETNormal().subscribe((data: any) => {
            this.sendData = data;
            //console.log('sendData: ', this.sendData);
          });
        }, 60000);
      }
    
      ngOnDestroy() {
        // Si un abonnement est défini, le désabonner pour éviter les fuites de mémoire
        if (this.equipementsSubscription) {
          this.equipementsSubscription.unsubscribe();
        }
        this.floorService.stopDjangoMethod();
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
      }
    
      ngOnChanges() {
        this.LoadEquipements()
      }
    
      LoadEquipements(){
        this.EquipementsLoading = true;
    
        // Désactiver le boutton refresh :
        this.refreshButtonEnabled(false)
    
        if(this.dateDebut && !this.dateFin){  this.dateFinAlert() }
    
        else if (!this.dateDebut && this.dateFin) { this.dateDebutAlert() }
    
        else if(this.dateDebut && this.dateFin){
          let dateFinObj = new Date(this.dateFin);
          //console.log('---------------------------dateFinObj: ', dateFinObj)
          
          let now = new Date();
          //console.log('---------------------------now: ', now)
          let dateHeureDebut = this.dateDebut + ' 00:00:0'
          if(this.heureDebut)  { dateHeureDebut = this.dateDebut+' '+this.heureDebut+':0'}
          else { this.el.nativeElement.querySelector('#heureDebut').value = '00:00:00'}
    
          let dateHeureFin = this.dateFin + ' 00:00:0'
          if(this.heureFin) {dateHeureFin = this.dateFin+' '+this.heureFin+':0'}
          else { this.el.nativeElement.querySelector('#heureFin').value = '00:00:00' }
    
          if(new Date(this.dateDebut) >= new Date(this.dateFin)) {  this.invalidDatesAlert()  }
          else 
      
          if (new Date(dateHeureFin) > now) {
            //console.log("La date de fin ne peut pas être dans le futur.");
            //console.log('date de fin: ', this.dateFin)
            //console.log('now: ', now)
            this.invalidDatesAlertDepasse()
          }
          else {  // dateDebut < dateFin
            this.hideAllAlerts()
    
            // Charger les équipements :
            this.floorService.getConsommationEquipementParPeriode(dateHeureDebut, dateHeureFin).subscribe(
              (data: any[]) => {
                this.EquipementsLoading = false;
                this.refreshButtonEnabled(true)   // Réactiver le boutton refresh:
    
                this.equipements = data;
                this.Consommation_totale=0;
                data.forEach(eq => {
                  this.Consommation_totale+=eq.consommation_kW
                })
                this.equipementsParLocal = this.RegrouperEquipementParLocal();
                this.equipementsParEtage = this.RegrouperEquipementParEtage();
                this.equipementsParBatiment = this.RegrouperEquipementParBatiment();
                this.equipementsParCategorie = this.RegrouperEquipementParCategorie();
                this.equipementsParCriticite = this.RegrouperEquipementParCriticite();
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
    
          //console.log('peeeriode: ', '2024-'+(new Date().getMonth()+1)+'-01 00:00:00',' -> ', isoDateString.slice(0, 19).replace('T', ' '))
          this.floorService.getConsommationEquipementParPeriode('2024-'+(new Date().getMonth()+1)+'-01 00:00:00', isoDateString.slice(0, 19).replace('T', ' ')).subscribe(
            (data: any[]) => {
              //console.log('equips : ', data)
              this.EquipementsLoading = false;
              this.refreshButtonEnabled(true)
    
              this.equipements = data;
              this.Consommation_totale=0;
              data.forEach(eq => {
                this.Consommation_totale+=eq.consommation_kW
              })
              this.equipementsParLocal = this.RegrouperEquipementParLocal();
              this.equipementsParEtage = this.RegrouperEquipementParEtage();
              this.equipementsParBatiment = this.RegrouperEquipementParBatiment();
              this.equipementsParCategorie = this.RegrouperEquipementParCategorie();
              this.equipementsParCriticite = this.RegrouperEquipementParCriticite();
            }
          );
        }
      }
    
      RegrouperEquipementParLocal(){
          // Regrouper les équipements par local
          const equipementsParLocal: { [key: number]: any[] } = this.equipements.reduce((acc: { [x: string]: any[]; }, equipement: any) => {
            const { localId } = equipement;
    
            // S'il n'existe pas, créez une nouvelle liste pour cet étage
            if (!acc[localId]) {
                acc[localId] = [];
            }
            acc[localId].push(equipement);
            return acc;
          }, {});
          //console.log('equipementsParLocalD: ', equipementsParLocal)
          return equipementsParLocal;
      }
    
      RegrouperEquipementParEtage(){
        // Regrouper les équipements par etage
        const equipementsParEtage: { [key: number]: any[] } = this.equipements.reduce((acc: { [x: number]: any[]; }, equipement: any) => {
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
        const equipementsParBatiment: { [key: number]: any[] } = this.equipements.reduce((acc: { [x: string]: any[]; }, equipement: any) => {
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
    
      RegrouperEquipementParCategorie(){
        // Regrouper les équipements par etage
        //console.log('this.equipements _____', this.equipements)
        const equipementsParCategorie: { [key: number]: any[] } = this.equipements.reduce((acc: { [x: string]: any[]; }, equipement: any) => {
          const { type } = equipement;
    
          // S'il n'existe pas, créez une nouvelle liste pour cet étage
          if (!acc[type]) {
              acc[type] = [];
          }
          acc[type].push(equipement);
          return acc;
        }, {});
        //console.log('equipementsParCategorie DDDD', equipementsParCategorie)
        return equipementsParCategorie;
      }
    
      RegrouperEquipementParCriticite(){
        // Regrouper les équipements par etage
        //console.log('this.equipements _____', this.equipements)
        const equipementsParCriticite: { [key: number]: any[] } = this.equipements.reduce((acc: { [x: string]: any[]; }, equipement: any) => {
          const { categorie } = equipement;
    
          // S'il n'existe pas, créez une nouvelle liste pour cet étage
          if (!acc[categorie]) {
              acc[categorie] = [];
          }
          acc[categorie].push(equipement);
          return acc;
        }, {});
        //console.log('equipementsParCriticite DDDD', equipementsParCriticite)
        return equipementsParCriticite;
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
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-depasse'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dates-warning'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut-missed'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-missed'), 'style', 'display: flex');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut'), 'style', 'border: 1px solid transparent;');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureDebut'), 'style', 'border: 1px solid transparent;');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin'), 'style', 'border: 1px solid #c91c1c;');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureFin'), 'style', 'border: 1px solid #c91c1c;');
      }
      invalidDatesAlertDepasse(){
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-depasse'), 'style', 'display: flex');
    
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut-missed'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-missed'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dates-warning'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut'), 'style', 'border: 1px solid transparent;');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureDebut'), 'style', 'border:1px solid transparent;');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin'), 'style', 'border: 1px solid #c91c1c;');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureFin'), 'style', 'border: 1px solid #c91c1c;');
      }
      dateDebutAlert(){
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-depasse'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dates-warning'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-missed'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut-missed'), 'style', 'display: flex');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin'), 'style', 'border: 1px solid transparent;');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureFin'), 'style', 'border: 1px solid transparent;');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut'), 'style', 'border: 1px solid #c91c1c;');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureDebut'), 'style', 'border: 1px solid #c91c1c;');
      }
    
      invalidDatesAlert(){
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-depasse'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut-missed'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-missed'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dates-warning'), 'style', 'display: flex');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut'), 'style', 'border: 1px solid #c91c1c;');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureDebut'), 'style', 'border: 1px solid #c91c1c;');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin'), 'style', 'border: 1px solid #c91c1c;');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#heureFin'), 'style', 'border: 1px solid #c91c1c;');
      }
    
      hideAllAlerts(){
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-depasse'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dates-warning'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateDebut-missed'), 'style', 'display: none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('#dateFin-missed'), 'style', 'display: none');
      }
    
      handleAlerteChange(event: any) {
    
        //console.log('j ai reçu alerte maint ? ', event.type)
        if (event.type == 'maintenance') {
          //console.log('local '+ event.localId+ ': ', event.nomLocal +' type: ',  event.type+' now: '+ event.nowSlash)
          this.AlerteMessage = 'Mr/Mme ' + event.userID + 'Local ' + event.localId + ' : ' + event.nomLocal + ' type : ' + event.type;
          //console.log('rrrrrrrrrr ', this.AlerteMessage)
    
          setTimeout(() => {
            this.AlerteMessage = '';
          }, 5000);
    
        } else {
          //console.log('local '+ event.localId+ ': ', event.nomLocal +' type: ',  event.type+' now: '+ event.nowSlash)
          this.AlerteMessage = 'Local '+ event.localId + ' : '+ event.nomLocal+' enregistre une '+ event.type+ ' moyenne inhabituelle';
          //console.log('rrrrrrrrrr ', this.AlerteMessage)
          setTimeout(() => {
            this.AlerteMessage = '';
            // Effacer le message après quelques secondes
              // Redirigez l'utilisateur vers la page de tableau de bord après la connexion réussie
          }, 5000);
        }
      }
    
      redirectToAlerteDetails(alerteId: number) {
        //console.log('alerteId', alerteId)
        this.router.navigate(['/alerte-details/', alerteId]);
      }
    
    }