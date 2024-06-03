import { Component, ElementRef,OnDestroy, Renderer2, Input, OnInit,Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FloorService } from '../service/floor.service';
import { TranslateService } from '@ngx-translate/core';
import { ColorString } from 'highcharts/highcharts.src';
import {Subscription,interval} from 'rxjs';
import { WebSocketService } from '../service/web-socket.service';
import { SoundService } from '../service/sound.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


@Injectable({
  providedIn: 'root'
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
  webSocket: any[] = []; 
  user: any;
  role: any;
  AlerteId: any;
  alertesNew: any;
  rapportNew: any;
  rapports: any;
  message: string = '';
  alerteSubscription: Subscription | undefined;
  rapportSubscription: Subscription | undefined;
  onAlertChange(local: string, temperature: number, nowSlash: ColorString) {
    //console.log(`Alert received: Local: ${local}, Temperature: ${temperature}, Now: ${nowSlash}`);
  }

  AlerteMessage: string = '';
  AlerteMessageUser: string = '';

  constructor( private soundService: SoundService,private wsService: WebSocketService,private floorService: FloorService, private router: Router,private translate: TranslateService, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn')
  }

  currentSection: string = '';
 
  ngOnInit() {
    this.user = sessionStorage.getItem('id');
    this.role = sessionStorage.getItem('role');
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn')
    this.lang = sessionStorage.getItem('lang') || 'fr';
    if(this.role === 'Responsable de maintenance' || this.role === 'responsable de maintenance') {
      this.floorService.getAlertesById(this.user).subscribe(
        (data) => {
          console.log('cas maintenance : ')
          this.alertes = data;
          this.alertesNew = 0;
          this.trieralertes(this.alertes);
          
        }
      )
    } 
    
    if(this.role === 'Admin' || this.role === 'Moyen generaux' || this.role === 'moyen generaux') {
      this.floorService.getAlertesSansId().subscribe((alertes: any) => {
        console.log('cas contraire : ')
        console.log('alertes : ', alertes)
        this.alertes = alertes;
        this.alertesNew = 0;
        this.trieralertes(this.alertes);
      });
    }
   const roomName = 'notification_test';
    if(this.role === 'Moyen generaux' || this.role === 'moyen generaux') {
    this.wsService.connect(roomName).subscribe(
      (message) => {
        console.log('Received message:', message);
        this.webSocket.unshift(message.message);
        if(this.role === 'Moyen generaux' || this.role === 'moyen generaux') {

          if(message && message.message){
            const{id} = message.message;
            this.AlerteId = id;
            console.log('id ----------->', id)
            const { text, localId, type } = message.message; // Récupérez les propriétés nécessaires du message
            this.AlerteMessage = `vous avez une alerte au Local ${localId}: ${text} type: ${type}`;
            console.log('les alertes  avanr push-------------->', this.alertes)
            this.alertes.push(message.message);
            console.log('les alertes  apres push-------------->', this.alertes)
            console.log('rrrrrrrrrr ', this.AlerteMessage)
            this.soundService.beep(200, 440, 100);
            setTimeout(() => {
              this.AlerteMessage = '';
              window.location.reload();
          }, 5000);
          }
        }
      },
      (error) => {
        console.error('WebSocket error:', error);
      },
      
    );
    }
    if(this.role === 'Responsable de maintenance' || this.role === 'responsable de maintenance') {
    this.wsService.connectUser().subscribe((messageUser: any) => {
      
      console.log('Received messageUSER :', messageUser);
        this.webSocket.unshift(messageUser.message);
        if(this.role === 'Responsable de maintenance' || this.role === 'responsable de maintenance') {
          if(messageUser && messageUser.message){
            const{id} = messageUser.message;
            this.AlerteId = id;
            console.log('id ----------->', id)
            const { text, localId, type } = messageUser.message; // Récupérez les propriétés nécessaires du message
            this.AlerteMessageUser = `vous avez une alerte pour faire un rapport`;
            //this.alertes.push(this.AlerteMessage);
            console.log('rrrrrrrrrr ', this.AlerteMessageUser)
            this.soundService.beep(200, 440, 100);
            setTimeout(() => {
              this.AlerteMessageUser = '';
              window.location.reload();
          }, 5000);
          }
        }
    })
    }  
    /* this.webSocketService.getMessages().subscribe((message: string) => {
      console.log('Message from Django:', message);
      // Traitez le message ici (par exemple, affichez-le dans une alerte)
    }); */
    
    
    
   
     /*if(this.isLoggedIn === 'true') {
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
    } */
  }
 /*  sendMessage() {
    this.webSocketService.sendMessage('Hello from Angular!');
  } */
  trieralertes(alertes: any) {
    //console.log("alertes ",this.alertes)
      this.alertes.forEach((alerte: any) => {
        
        if(alerte.vu==false){
          this.alertesNew++;//console.log(alerte)
        }
      })
  }
  redirectToAlerteDetails(alerteId: number) {
    this.AlerteMessage = '';
    console.log('alerteId', alerteId)
    this.router.navigate(['/alerte-details/', alerteId]);
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
    //this.wsService.close();
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
    sessionStorage.setItem('lang', selectedLanguage);

    this.translate.use(selectedLanguage);
  }
}