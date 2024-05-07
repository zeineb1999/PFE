import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class SignComponent {

  username?: string;
  password?: string;
  successMessage?: string;
  selectedRole?: string;

  roles = ['Responsable de maintenance', 'Moyens génraux', 'Administrateur', 'Responsable de l\'hopital'];
  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  sign() {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe(response => {
        console.log(response)
        localStorage.setItem('token', response.access);
        this.successMessage = 'Connexion réussie !';
        setTimeout(() => {
          localStorage.setItem('isLoggedIn', 'true');
          this.successMessage = ''; // Effacer le message après quelques secondes
          this.router.navigate(['/profile']); // Redirigez l'utilisateur vers la page de tableau de bord après la connexion réussie
        }, 1000); // 3000 millisecondes = 3 secondes
      });
    }
  }
  selectRole(role: string) {
    this.selectedRole = role;
}
isPasswordVisible: boolean = false;

togglePasswordVisibility(): void {
  this.isPasswordVisible = !this.isPasswordVisible;
}

}