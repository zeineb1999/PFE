import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  newUsername: string = '';
  newFirstname: string = '';
  newLastname: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile;
    });

  }
  updateProfile() {
    this.authService.updateUserProfile(this.newUsername, this.newFirstname, this.newLastname)
      .subscribe(response => {
        // Mettre à jour les données du profil affichées si nécessaire
      });
  }
  
}
