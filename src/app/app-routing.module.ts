import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


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
import { EquipementDetailsComponent } from './ajout/equipement-details/equipement-details.component';
import { UpdateEquipementComponent } from './ajout/update-equipement/update-equipement.component';
import { UpdateZoneComponent } from './ajout/update-zone/update-zone.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AjouterZoneSansEtageComponent } from './ajout/ajouter-zone-sans-etage/ajouter-zone-sans-etage.component';
import  {FacturesComponent} from './factures/factures.component';
import { ArchitectureComponent } from './architecture/architecture.component';
import { ChangerPasswordComponent } from './changer-password/changer-password.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { AlerteDetailsComponent } from './alerte-details/alerte-details.component';
import { RedigerRapportComponent } from './rediger-rapport/rediger-rapport.component';
import { RapportComponent } from './rapport/rapport.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { AjouterBatimentComponent } from './ajout/ajouter-batiment/ajouter-batiment.component';
import { RapportDetailsComponent } from './rapport-details/rapport-details.component';
import { ArchiComponent } from './archi/archi.component';
import { AjouterEquipementRemplacementComponent } from './ajout/ajouter-equipement-remplacement/ajouter-equipement-remplacement.component';
import { HistoryComponent } from './history/history.component';
import { PredictionComponent } from './prediction/prediction.component';
const routes: Routes = [
  
  
 
  {path: '', component:AcceuilComponent },
  {path:'ajouterBatiment',component:AjouterBatimentComponent},
  {path:'utilisateurs',component:UtilisateursComponent},
  {path: 'rediger-rapport/:alerteId', component: RedigerRapportComponent },
  {path : 'forgetPassword',component:ForgetPassComponent},
  {path : 'signup',component:LoginComponent},
  //{path : 'signup/login',component:SignComponent},
  {path : 'login',component:SignComponent},
  {path:'profile',component:ProfileComponent},
  {path:'ajouterEtage/:batimentId',component:AjouterEtageComponent},
  {path:'ajouterZone',component:AjouterZoneComponent},
  {path:'ajouterZone/:etageId',component:AjouterZoneSansEtageComponent},
  {path:'ajouterEquipement/:zoneId',component:AjouterEquipementComponent},
  {path:'ajouterEquipement',component:AjoutEquipementSansZoneComponent},
  {path:'toutesZones',component:ToutesZonesComponent},
  {path: 'zone-details/:zoneId', component: ZoneDetailsComponent },
  {path: 'equipement-details/:equipementId', component: EquipementDetailsComponent },
  {path: 'equipements', component: EquipementsComponent },
  {path: 'dashboard', component: DashboardComponent },
  {path: 'updateEquipement/:equipementId', component: UpdateEquipementComponent },
  {path: 'updateZone/:zoneId', component: UpdateZoneComponent },
  {path: 'notifications', component: NotificationsComponent },
  {path: 'factures', component: FacturesComponent },
  {path: 'architecture', component: ArchitectureComponent}, 
  {path: 'archi', component: ArchiComponent},
  { path: 'changerPassword/:uidb64/:token', component: ChangerPasswordComponent },
  { path: 'dashboard2', component: Dashboard2Component },
  { path: 'acceuil', component: AcceuilComponent },
  {path: 'alerte-details/:alerteId', component: AlerteDetailsComponent },
  {path: 'rapport', component: RapportComponent },
  {path: 'rapport-details/:alerteId', component: RapportDetailsComponent },
  { path: 'ajouterEquipementRemplacement/:zoneId/:id/:rapport', component: AjouterEquipementRemplacementComponent },
  {path:'history',component:HistoryComponent},
  {path:'predection',component:PredictionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
