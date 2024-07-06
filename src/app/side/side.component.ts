import { Component, ElementRef, Renderer2, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FloorService } from '../service/floor.service';
import { TranslateService } from '@ngx-translate/core';
import { ColorString } from 'highcharts/highcharts.src';

import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent {

   lang: string = '';
  nomPage: string = '';
  @Input() local: string ='';
  @Input() type: string='';
  @Input() nowSlash: string = '';
  open: Boolean = false
  alertes: any;
  isLoggedIn: any;
  user: any;
  role: any;
  url: string='';
  onAlertChange(local: string, temperature: number, nowSlash: ColorString) {
    //console.log(`Alert received: Local: ${local}, Temperature: ${temperature}, Now: ${nowSlash}`);
  }

  AlerteMessage: string = '';

  constructor(private authService: AuthService,private floorService: FloorService, private router: Router,private translate: TranslateService, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn');
  
  }

  currentSection: string = '';

  ngOnInit() {
    this.url = window.location.href;
    //console.log(this.url)
    this.user = sessionStorage.getItem('id');
    this.role = sessionStorage.getItem('role');
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn')
    this.lang = sessionStorage.getItem('lang') || 'fr';
   /*  if(this.role =='responsable de maintenance' || this.role =='Responsable de maintenance'){
      this.floorService.getAlertesById(this.user).subscribe((alertes: any) => {
        this.alertes = alertes
      })
    }
    else{
      this.floorService.getAlertesSansId().subscribe((alertes: any) => {
        this.alertes = alertes
      })
    } */
  }

  getCurrentSection() {
    return window.location.hash
  }

  getCurrentPage() {
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
  switchLanguage(language: string) {
    this.translate.use(language);
  }
  ChangeLang(lang:any){
    const selectedLanguage= lang.target.value;
    sessionStorage.setItem('lang', selectedLanguage);

    this.translate.use(selectedLanguage);
  }
  logout() {
    this.authService.changementHeader.next("changmenet header")
    //console.log("methode deconnexion")
    this.authService.logout();
  }

}