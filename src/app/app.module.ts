import { NgModule,LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule  } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { FaceSnapComponent } from './face-snap/face-snap.component';
import { FaceSnapListComponent } from './face-snap-list/face-snap-list.component';
import { HeaderComponent } from './header/header.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SingleFaceSnapComponent } from './single-face-snap/single-face-snap.component';
import { FooterComponent } from './footer/footer.component';
import { SideComponent } from './side/side.component';
import { ForgetPassComponent } from './forget-pass/forget-pass.component';
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

@NgModule({
  declarations: [
    AppComponent,
    FaceSnapComponent,
    FaceSnapListComponent,
    HeaderComponent,
    LandingPageComponent,
    SingleFaceSnapComponent,
    FooterComponent,
    SideComponent,
    ForgetPassComponent,
    LoginComponent,
    SignComponent,
    ProfileComponent,
    AjouterEtageComponent,
    AjouterZoneComponent,
    AjouterEquipementComponent,
    ToutesZonesComponent,
    ZoneDetailsComponent,
    EquipementsComponent,
    AjoutEquipementSansZoneComponent,
    DashboardComponent,
    ThreejsSceneComponent,
    EquipementDetailsComponent,
    UpdateEquipementComponent,
    UpdateZoneComponent,
  
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    registerLocaleData(fr.default);
  }
}
