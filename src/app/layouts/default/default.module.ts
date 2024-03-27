import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { DefaultComponent } from './default.component';
import { RouterModule } from '@angular/router';

import { HeaderTwoComponent } from 'src/app/shared/components/header-two/header-two.component';
import { FooterTwoComponent } from 'src/app/shared/components/footer-two/footer-two.component';
import { PostsComponent } from 'src/app/modules/posts/posts.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider'

@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    PostsComponent
   
   
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule
  ]
})
export class DefaultModule { }
