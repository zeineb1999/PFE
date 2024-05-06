

import { Component, OnInit } from '@angular/core';
import { FloorService } from '../service/floor.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [
   
  ];
  notificationsMaintenance :any[] = [] // C'est un exemple, vous devez remplacer cela par vos données de notifications réelles
  isLoggedIn: boolean;
  roleUser: any;
  idUser: any;
  constructor(private floorService: FloorService) { this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.roleUser=localStorage.getItem('role');
    this.idUser=localStorage.getItem('id');
   }

  ngOnInit(): void {

    this.floorService.getAllAlertes().subscribe(
      (response: any) => {
        this.notifications = response;
      }
    )
    if(this.roleUser=="Responsable de maintenance"){
      this.floorService.getAlertesById(this.idUser).subscribe(
        (response: any) => {
          this.notificationsMaintenance = response;
        }
      )

    }

  }

}
