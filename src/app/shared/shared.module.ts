import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTwoComponent } from './components/header-two/header-two.component';
import { FooterTwoComponent } from './components/footer-two/footer-two.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import{MatDividerModule} from '@angular/material/divider'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button'
import  {MatMenuModule} from '@angular/material/menu'
import {MatListModule} from '@angular/material/list'
import { RouterModule } from '@angular/router';
import { AreaComponent } from './widgets/area/area.component';
import { HighchartsChartModule } from 'highcharts-angular';
@NgModule({
  declarations: [
    HeaderTwoComponent,
    FooterTwoComponent,
    SidebarComponent,
    AreaComponent,
   
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    HighchartsChartModule

  ],
  exports:[
    HeaderTwoComponent,
    FooterTwoComponent,
    SidebarComponent,
    AreaComponent

  ]

})
export class SharedModule { }
