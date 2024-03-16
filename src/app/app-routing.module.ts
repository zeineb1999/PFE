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

const routes: Routes = [
  { path: 'facesnaps/:id', component: SingleFaceSnapComponent },
  { path: 'facesnaps', component: FaceSnapListComponent },
  {path: '', component:SignComponent },
  {path : 'forgetPassword',component:ForgetPassComponent},
  {path : 'signup',component:LoginComponent},
  {path : 'signup/login',component:SignComponent},
  {path : 'login',component:SignComponent},
  {path:'profile',component:ProfileComponent},
  {path:'ajouterEtage',component:AjouterEtageComponent},
  {path:'ajouterZone',component:AjouterZoneComponent},
  {path:'ajouterEquipement/:zoneId',component:AjouterEquipementComponent},
  {path:'ajouterEquipement',component:AjoutEquipementSansZoneComponent},
  {path:'toutesZones',component:ToutesZonesComponent},
  { path: 'zone-details/:zoneId', component: ZoneDetailsComponent },
  { path: 'equipement-details/:equipementId', component: EquipementDetailsComponent },
  {path: 'equipements', component: EquipementsComponent },
  {path: 'dashboard', component: DashboardComponent },
  {path: 'threejs', component: ThreejsSceneComponent },
  {path: 'updateEquipement/:equipementId', component: UpdateEquipementComponent },
  {path: 'updateZone/:zoneId', component: UpdateZoneComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
