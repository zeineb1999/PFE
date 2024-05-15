import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.css']
})
export class AcceuilComponent {
  username?: string;
  password?: string;
  successMessage?: string;
  currentSection: any;
  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit(){
    this.currentSection = window.location.hash
  }
  sign() {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe(response => {
        console.log(response)
        sessionStorage.setItem('token', response.access);
        this.successMessage = 'Connexion réussie !';
        setTimeout(() => {
          sessionStorage.setItem('isLoggedIn', 'true');
          this.successMessage = ''; // Effacer le message après quelques secondes
          this.router.navigate(['/profile']); // Redirigez l'utilisateur vers la page de tableau de bord après la connexion réussie
        }, 1000); // 3000 millisecondes = 3 secondes
      });
    }
  }

}