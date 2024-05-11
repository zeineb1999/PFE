import { Component, ElementRef,OnDestroy, Renderer2, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FloorService } from '../service/floor.service';
import { TranslateService } from '@ngx-translate/core';
import { ColorString } from 'highcharts/highcharts.src';
import {Subscription,interval} from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  lang: string = '';
  nomPage: string = '';
  @Input() local: string ='';
  @Input() type: string='';
  @Input() nowSlash: string = '';
  open: Boolean = false
  openRapport: Boolean = false
  alertes: any;
  isLoggedIn: any;
  user: any;
  role: any;
  alertesNew: any;
  rapportNew: any;
  rapports: any;
  alerteSubscription: Subscription | undefined;
  rapportSubscription: Subscription | undefined;
  onAlertChange(local: string, temperature: number, nowSlash: ColorString) {
    //console.log(`Alert received: Local: ${local}, Temperature: ${temperature}, Now: ${nowSlash}`);
  }

  AlerteMessage: string = '';

  constructor(private floorService: FloorService, private router: Router,private translate: TranslateService, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn')
  }

  currentSection: string = '';

  ngOnInit() {
    
    this.user = localStorage.getItem('id');
    this.role = localStorage.getItem('role');
    this.isLoggedIn = localStorage.getItem('isLoggedIn')
    this.lang = localStorage.getItem('lang') || 'fr';
    if(this.isLoggedIn === 'true') {
      this.rapportSubscription = interval(1000).subscribe(() => {
        
        if (this.role === 'Moyen generaux' || this.role === 'moyen generaux') {
          this.floorService.getAllRapports().subscribe((rapports: any) => {
            this.rapports = rapports;
            this.rapportNew = 0;
            this.trierrapports(this.rapports);

          });

        } 
        
        

      });
      this.alerteSubscription = interval(1000).subscribe(() => {
        
        if (this.role === 'responsable de maintenance' || this.role === 'Responsable de maintenance') {
          this.floorService.getAlertesById(this.user).subscribe((alertes: any) => {
            this.alertes = alertes;
            this.alertesNew = 0;
            this.trieralertes(this.alertes);

          });

        } else {
          this.floorService.getAlertesSansId().subscribe((alertes: any) => {
            this.alertes = alertes;
            this.alertesNew = 0;
            this.trieralertes(this.alertes);
          });
        }
        

      });
    }
  }
  trieralertes(alertes: any) {
    //console.log("alertes ",this.alertes)
      this.alertes.forEach((alerte: any) => {
        
        if(alerte.vu==false){
          this.alertesNew++;//console.log(alerte)
        }
      })
  }
  trierrapports(rapports: any) {
    //console.log("alertes ",this.alertes)
      this.rapports.forEach((rapport: any) => {
        
        if(rapport.vu==false){
          this.rapportNew++;//console.log(alerte)
        }
      })
  }
  ngOnDestroy(): void {
    // Libérer la souscription lors de la destruction du composant
    if (this.alerteSubscription) {
      this.alerteSubscription.unsubscribe();
    }
    if (this.rapportSubscription) {
      this.rapportSubscription.unsubscribe();
    }
  }


  getCurrentSection(){
    return window.location.hash
  }

  getCurrentPage(){
    return this.router.url.split('/').pop() || 'dashboard';
  }



  handleAlerteChange(event: any) {

    if (event.type == 'maintenance') {
      //console.log('local '+ event.localId+ ': ', event.nomLocal +' type: ',  event.type+' now: '+ event.nowSlash)
      this.AlerteMessage = 'Local '+ event.localId + ' : '+ event.nomLocal+' type : '+ event.type;
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

  open_close() {
    let notifElement = this.el.nativeElement.querySelector('#notifs');
    this.open = !this.open
    //console.log('open', this.open)
    if (this.open) {
      this.renderer.setAttribute(notifElement, 'style', 'display: flex; width: 400px; height: 300px;');

    } else {
      this.renderer.setAttribute(notifElement, 'style', 'display: none;');
    }
  }
  open_closeRapport() {
    let notifElement = this.el.nativeElement.querySelector('#rapports');
    this.openRapport = !this.openRapport
    //console.log('open', this.open)
    if (this.openRapport) {
      this.renderer.setAttribute(notifElement, 'style', 'display: flex; width: 400px; height: 300px;');

    } else {
      this.renderer.setAttribute(notifElement, 'style', 'display: none;');
    }
  }
  switchLanguage(language: string) {
    this.translate.use(language);
  }
  ChangeLang(lang:string){
    const selectedLanguage= lang;
    localStorage.setItem('lang', selectedLanguage);

    this.translate.use(selectedLanguage);
  }
}