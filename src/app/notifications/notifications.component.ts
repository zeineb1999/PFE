

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: string[] = [
    'Notification 1',
    'Notification 2',
    'Notification 3'
  ]; // C'est un exemple, vous devez remplacer cela par vos données de notifications réelles
  isLoggedIn: boolean;
 
  constructor() { this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; }

  ngOnInit(): void {
  }

}
