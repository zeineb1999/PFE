import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceSnapListComponent } from './face-snap-list/face-snap-list.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import {SingleFaceSnapComponent} from './single-face-snap/single-face-snap.component';
import {ForgetPassComponent} from './forget-pass/forget-pass.component';
import { LoginComponent } from './login/login.component';
import { SignComponent } from './sign/sign.component';
import { ProfileComponent } from './profile/profile.component';
import { AjouterEtageComponent } from './ajout/ajouter-etage/ajouter-etage.component';
import { AjouterZoneComponent } from './ajout/ajouter-zone/ajouter-zone.component';
import { AjouterEquipementComponent } from './ajout/ajouter-equipement/ajouter-equipement.component';
import { ToutesZonesComponent } from './ajout/toutes-zones/toutes-zones.component';
import { ZoneDetailsComponent } from './ajout/zone-details/zone-details.component';
import { EquipementsComponent } from './ajout/equipements/equipements.component';
import { AjoutEquipementSansZoneComponent } from './ajout/ajout-equipement-sans-zone/ajout-equipement-sans-zone.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ThreejsSceneComponent } from './threejs-scene/threejs-scene.component';
import { EquipementDetailsComponent } from './ajout/equipement-details/equipement-details.component';
import { UpdateEquipementComponent } from './ajout/update-equipement/update-equipement.component';
import { UpdateZoneComponent } from './ajout/update-zone/update-zone.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AjouterZoneSansEtageComponent } from './ajout/ajouter-zone-sans-etage/ajouter-zone-sans-etage.component';
import  {FacturesComponent} from './factures/factures.component';
import { HopitalConfigComponent } from './hopital-config/hopital-config.component';
import { DefaultComponent } from './layouts/default/default.component';
import { PostsComponent } from './modules/posts/posts.component';
import { GrapheComponent } from './graphe/graphe.component';
import { ArchitectureComponent } from './architecture/architecture.component';

const routes: Routes = [
  
  { path: 'facesnaps/:id', component: SingleFaceSnapComponent },
  { path: 'facesnaps', component: FaceSnapListComponent },
  {path: '', component:SignComponent },
  {path: '', component:DefaultComponent,children:[
  {path: '', component:DashboardComponent
  },{
   path: 'posts', component:PostsComponent}
  ]},
  {path: 'dashboard',component:GrapheComponent},
  {path : 'forgetPassword',component:ForgetPassComponent},
  {path : 'signup',component:LoginComponent},
  {path : 'signup/login',component:SignComponent},
  {path : 'login',component:SignComponent},
  {path:'profile',component:ProfileComponent},
  {path:'ajouterEtage',component:AjouterEtageComponent},
  {path:'ajouterZone',component:AjouterZoneComponent},
  {path:'ajouterZone/:etageId',component:AjouterZoneSansEtageComponent},
  {path:'ajouterEquipement/:zoneId',component:AjouterEquipementComponent},
  {path:'ajouterEquipement',component:AjoutEquipementSansZoneComponent},
  {path:'toutesZones',component:ToutesZonesComponent},
  {path: 'zone-details/:zoneId', component: ZoneDetailsComponent },
  {path: 'equipement-details/:equipementId', component: EquipementDetailsComponent },
  {path: 'equipements', component: EquipementsComponent },
  {path: 'dashboard', component: DashboardComponent },
  {path: 'threejs', component: ThreejsSceneComponent },
  {path: 'updateEquipement/:equipementId', component: UpdateEquipementComponent },
  {path: 'updateZone/:zoneId', component: UpdateZoneComponent },
  {path: 'notifications', component: NotificationsComponent },
  {path: 'factures', component: FacturesComponent },
  {path: 'hopitalConfig', component: HopitalConfigComponent},
  {path: 'architecture', component: ArchitectureComponent},

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
