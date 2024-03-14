import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent {

  username?: string;
  password?: string;
  successMessage?: string;
  constructor(private authService: AuthService, private router: Router) { }

  sign() {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe(response => {
        console.log(response)
        localStorage.setItem('token', response.access);
        this.successMessage = 'Connexion réussie !';
      setTimeout(() => {
        this.successMessage = ''; // Effacer le message après quelques secondes
        this.router.navigate(['/profile']); // Redirigez l'utilisateur vers la page de tableau de bord après la connexion réussie
      }, 3000); // 3000 millisecondes = 3 secondes
    });
  }
}
}
  