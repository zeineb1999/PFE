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
const routes: Routes = [
  { path: 'facesnaps/:id', component: SingleFaceSnapComponent },
  { path: 'facesnaps', component: FaceSnapListComponent },
  {path: '', component:SignComponent },
  {path : 'forgetPassword',component:ForgetPassComponent},
  {path : 'signup',component:LoginComponent},
  {path : 'signup/login',component:SignComponent},
  {path : 'login',component:SignComponent},
  {path:'profile',component:ProfileComponent},
  {path:'profile/login',component:SignComponent},
  {path:'ajouterEtage',component:AjouterEtageComponent},
  {path:'ajouterZone',component:AjouterZoneComponent},
  {path:'ajouterEquipement/:zoneId',component:AjouterEquipementComponent},
  {path:'toutesZones',component:ToutesZonesComponent},
  { path: 'zone-details/:zoneId', component: ZoneDetailsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
