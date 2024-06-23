import { Component, ElementRef,OnDestroy, Renderer2, Input, OnInit,Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FloorService } from '../service/floor.service';
import { TranslateService } from '@ngx-translate/core';
import { ColorString } from 'highcharts/highcharts.src';
import {Subscription,interval} from 'rxjs';
import { WebSocketService } from '../service/web-socket.service';
import { SoundService } from '../service/sound.service';
import { AuthService } from '../service/auth.service';

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
  verif1:Boolean=false
  verif2:Boolean=false
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
  nbAlertes:any;
  nbRapport:any;
  rapport:any;
  data:any;
  alerteSubscription: Subscription | undefined;
  rapportSubscription: Subscription | undefined;
  onAlertChange(local: string, temperature: number, nowSlash: ColorString) {
    //console.log(`Alert received: Local: ${local}, Temperature: ${temperature}, Now: ${nowSlash}`);
  }

  AlerteMessage: string = '';
  AlerteMessageUser: string = '';

  constructor( private authservice:AuthService,private soundService: SoundService,private wsService: WebSocketService,private floorService: FloorService, private router: Router,private translate: TranslateService, private renderer: Renderer2, private el: ElementRef) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn')
  }

  currentSection: string = '';
 
  ngOnInit() {
    
    console.log("normalement darha ",this.user)
    this.role = sessionStorage.getItem('role');
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn')
    this.lang = sessionStorage.getItem('lang') || 'fr';
    this.user = sessionStorage.getItem('id');
    this.data={role:this.role,id:this.user}
    this.lancerSocket(this.data)
   /*  if (this.role === 'Responsable de l\'hopital') {
      this.verif2=true
      setInterval(() => {
        this.floorService.getAllRapports().subscribe((data) => {
          this.rapport = data;
          let cpt = 0
          data.forEach((alerte: any) => {
            if (!alerte.approuve) {
              cpt++
            }
          });

          this.nbRapport = cpt
         
          
          console.log("dfkjhereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",this.rapport);
        });
      }, 6000); 
    }
    if(this.role === 'Responsable de maintenance' || this.role === 'responsable de maintenance') {
      this.verif1=true
      console.log('userrrrrrrrrrrrrrr',this.user)
      setInterval(() => {
      this.floorService.getAlertesById(this.user).subscribe(
        (data) => {
          console.log('cas maintenance : ')
          this.alertes = data;
          console.log("les alertes ----------------",this.alertes)
          let cpt = 0
          data.forEach((alerte: any) => {
            if (alerte.vu == false) {
              cpt++
            }
          });

          this.nbAlertes = cpt
          
          this.alertesNew = 0;
          this.trieralertes(this.alertes);
          
        }
      ); }, 6000); 
    } 
    
    if( this.role === 'Moyen generaux' || this.role === 'moyen generaux') {
      this.verif1=true
      setInterval(() => {
      this.floorService.getAlertesSansId().subscribe((alertes: any) => {
        console.log('cas contraire : ')
        console.log('alertes : ', alertes)
        this.alertes = alertes;
        let cpt = 0
          alertes.forEach((alerte: any) => {
            if (alerte.vu == false) {
              cpt++
            }
          });
          this.nbAlertes = cpt
        this.alertesNew = 0;
        this.trieralertes(this.alertes);
      }); }, 6000); 
    } */
    this.floorService.lancementSocket.subscribe(
      (data) => {
        console.log("lancement socket",data)
        
        console.log("gettttttttttttttt",)
        this.lancerSocket(data);
        
       
     });
    this.authservice.changementHeader.subscribe(
      (data)=>{
        console.log("nsupprimiw",data)
        this.verif1=false
        this.verif2=false
      }
    )
    
   
  }
  lancerSocket(dataRecu:any){ if (dataRecu.role === 'Responsable de l\'hopital') {
      this.verif2=true
      setInterval(() => {
        this.floorService.getAllRapports().subscribe((data) => {
          this.rapport = data;
          let cpt = 0
          data.forEach((alerte: any) => {
            if (!alerte.approuve) {
              cpt++
            }
          });

          this.nbRapport = cpt
         
          
          console.log("dfkjhereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",this.rapport);
        });
      }, 6000); 
    }
    
    if(dataRecu.role === 'Responsable de maintenance' || dataRecu.role === 'responsable de maintenance') {
      this.verif1=true
      
      console.log('userrrrrrrrrrrrrrr',this.user)
      this.floorService.getAlertesById(dataRecu.id).subscribe(
        (data) => {
          console.log('cas maintenance : ')
          this.alertes = data;
          let annee: number, mois: number;
          this.alertes.forEach((alerte: any) => {
          if (alerte.dateAlerte) {
            annee =parseInt(alerte.dateAlerte.split('T')[0].split('-')[0])
            mois = parseInt(alerte.dateAlerte.split('T')[0].split('-')[1])
            alerte.dateAlerte = annee+'/'+ mois + '/' + alerte.dateAlerte.split('T')[0].split('-')[2] + ' '+ alerte.dateAlerte.split('T')[1].split(':')[0] + ':'+alerte.dateAlerte.split('T')[1].split(':')[1]
          }});
          console.log("les alertes ----------------",this.alertes)
          let cpt = 0
          data.forEach((alerte: any) => {
            if (alerte.vu == false) {
              cpt++
            }
          });

          this.nbAlertes = cpt
          
          this.alertesNew = 0;
          this.trieralertes(this.alertes);
          
        }
      ); 
    } 
    
    if( dataRecu.role === 'Moyen generaux' || dataRecu.role === 'moyen generaux') {
      this.verif1=true
      
      this.floorService.getAlertesSansId().subscribe((alertes: any) => {
        console.log('cas contraire : ')
        console.log('alertes : ', alertes)
        this.alertes = alertes;
        let annee: number, mois: number;
          this.alertes.forEach((alerte: any) => {
          if (alerte.dateAlerte) {
            annee =parseInt(alerte.dateAlerte.split('T')[0].split('-')[0])
            mois = parseInt(alerte.dateAlerte.split('T')[0].split('-')[1])
            alerte.dateAlerte = annee+'/'+ mois + '/' + alerte.dateAlerte.split('T')[0].split('-')[2] + ' '+ alerte.dateAlerte.split('T')[1].split(':')[0] + ':'+alerte.dateAlerte.split('T')[1].split(':')[1]
          }});
        let cpt = 0
          alertes.forEach((alerte: any) => {
            if (alerte.vu == false) {
              cpt++
            }
          });
          this.nbAlertes = cpt
        this.alertesNew = 0;
        this.trieralertes(this.alertes);
      });
    }
   const roomName = 'notification_test';
    if(dataRecu.role === 'Moyen generaux' || dataRecu.role === 'moyen generaux') {
     
    this.wsService.connect(roomName).subscribe(
      (message) => {
        console.log('Received message:', message);
        this.webSocket.unshift(message.message);
        if(dataRecu.role === 'Moyen generaux' || dataRecu.role === 'moyen generaux') {

          if(message && message.message){
            const{id} = message.message;
            this.AlerteId = id;
            console.log('id ----------->', id)
            const { text, equipementId, type } = message.message; // Récupérez les propriétés nécessaires du message
            this.AlerteMessage = `alerte de ${type} a l'equipement ${equipementId}:\n ${text} `;
           
            this.alertes.push(message.message);
            this.nbAlertes++;
      
            this.soundService.beep(200, 440, 100);
            setTimeout(() => {
              this.AlerteMessage = '';
              //this.refresh_nb_alerte();
          }, 5000);
          }
        }
      },
      (error) => {
        console.error('WebSocket error:', error);
      },
      
    );
    }
    if(dataRecu.role === 'Responsable de maintenance' || dataRecu.role === 'responsable de maintenance') {
      
    this.wsService.connectUser().subscribe((messageUser: any) => {
      
      console.log('Received messageUSER :', messageUser);
        this.webSocket.unshift(messageUser.message);
        if(dataRecu.role === 'Responsable de maintenance' || dataRecu.role === 'responsable de maintenance') {
          if(messageUser && messageUser.message){
            const{id} = messageUser.message;
            this.AlerteId = id;
            console.log('id ----------->', id)
            const { text, localId, type } = messageUser.message; // Récupérez les propriétés nécessaires du message
            this.AlerteMessageUser = ` alerte `;
            this.alertes.push(messageUser.message);
            this.nbAlertes++;
            console.log('rrrrrrrrrr ', this.AlerteMessageUser)
            this.soundService.beep(200, 440, 100);
            console.log("beeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeep")
            setTimeout(() => {
              this.AlerteMessageUser = '';
              //this.refresh_nb_alerte();
          }, 5000);
          }
        }
    })
    }  

  }
  refresh_nb_alerte() {
    this.floorService.getAlertesSansId().subscribe(
    (data) => {
      this.alertes = data;
      let annee: number, mois: number;
          this.alertes.forEach((alerte: any) => {
          if (alerte.dateAlerte) {
            annee =parseInt(alerte.dateAlerte.split('T')[0].split('-')[0])
            mois = parseInt(alerte.dateAlerte.split('T')[0].split('-')[1])
            alerte.dateAlerte = annee+'/'+ mois + '/' + alerte.dateAlerte.split('T')[0].split('-')[2] + ' '+ alerte.dateAlerte.split('T')[1].split(':')[0] + ':'+alerte.dateAlerte.split('T')[1].split(':')[1]
          }});
      let cpt = 0
      data.forEach((alerte: any) => {
        if (alerte.vu == false) {
          cpt++
        }
      });
      console.log("cpt",cpt)
      this.nbAlertes = cpt
      console.log("nb",this.nbAlertes)
    })
  }
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