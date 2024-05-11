import { NgModule,LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { initializeApp, getApp,provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
 // Assurez-vous de mettre le bon chemin ici
 
 import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
 import { TranslateHttpLoader } from '@ngx-translate/http-loader';
 import {  HttpClient } from '@angular/common/http';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule  } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';

import { HeaderComponent } from './header/header.component';
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

import { EquipementDetailsComponent } from './ajout/equipement-details/equipement-details.component';
import { UpdateEquipementComponent } from './ajout/update-equipement/update-equipement.component';
import { UpdateZoneComponent } from './ajout/update-zone/update-zone.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AjouterZoneSansEtageComponent } from './ajout/ajouter-zone-sans-etage/ajouter-zone-sans-etage.component';
import { UpdateEtageComponent } from './ajout/update-etage/update-etage.component';
import { FacturesComponent } from './factures/factures.component';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgApexchartsModule } from "ng-apexcharts";


import{MatDividerModule} from '@angular/material/divider'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button'
import  {MatMenuModule} from '@angular/material/menu'
import {MatListModule} from '@angular/material/list'
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import { ArchitectureComponent } from './architecture/architecture.component';
import { ChangerPasswordComponent } from './changer-password/changer-password.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { ConsumptionEvolution2Component } from './dashboard2/consumption-evolution2/consumption-evolution2.component';
import { EquipementsList2Component } from './dashboard2/equipements-list2/equipements-list2.component';
import { BuildingsConsumption2Component } from './dashboard2/buildings-consumption2/buildings-consumption2.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { LocalsListComponent } from './dashboard2/locals-list/locals-list.component';
import { AlerteDetailsComponent } from './alerte-details/alerte-details.component';
import { RedigerRapportComponent } from './rediger-rapport/rediger-rapport.component';
import { RapportComponent } from './rapport/rapport.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { AjouterBatimentComponent } from './ajout/ajouter-batiment/ajouter-batiment.component';
import { RapportDetailsComponent } from './rapport-details/rapport-details.component';
import { BarChartComponent } from './dashboard2/bar-chart/bar-chart.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
   
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
   
    EquipementDetailsComponent,
    UpdateEquipementComponent,
    UpdateZoneComponent,
    NotificationsComponent,
    AjouterZoneSansEtageComponent,
    UpdateEtageComponent,
    FacturesComponent,
  
    ArchitectureComponent,
    ChangerPasswordComponent,
   
    Dashboard2Component,
    ConsumptionEvolution2Component,
    EquipementsList2Component,
    BuildingsConsumption2Component,
    AcceuilComponent,
    LocalsListComponent,
    AlerteDetailsComponent,
    RedigerRapportComponent,
    RapportComponent,
    UtilisateursComponent,
    AjouterBatimentComponent,
    RapportDetailsComponent,
    BarChartComponent,
   
  

   
   
    
    
  
  ],
  imports: [
    //FontAwesomeModule,
    MatDividerModule,
    NgxPaginationModule,
    
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    HighchartsChartModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MatCardModule,
    NgApexchartsModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
    
  ],
  providers: [
    HttpClient,
    { provide: LOCALE_ID, useValue: 'fr-FR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    registerLocaleData(fr.default);
  }
}
