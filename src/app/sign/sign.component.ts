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

  username: string='';
  password: string = '';
  successMessage?: string;
  errorMessage?: string;
  selectedRole?: string;
  roleEntree: string = '';
  roleExact: string = '';
  id: number = 0;
  roles = ['Responsable de maintenance', 'Moyens génraux', 'Administrateur', 'Responsable de l\'hopital'];
  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  sign() {
    console.log("role ", this.roleEntree);
    if (this.username) {
        this.authService.getId(this.username).subscribe(response => {
            this.roleExact = response.role;
            console.log(this.roleExact);
            
            // Maintenant que nous avons reçu le rôle exact, procédons à la connexion
            this.attemptLogin();
        });
    }
}

attemptLogin() {
    // Vérifions si le rôle entré correspond au rôle exact
    if (this.roleEntree == this.roleExact) {
        this.authService.login(this.username, this.password).subscribe(response => {
            console.log(response);
            localStorage.setItem('token', response.access);
            this.successMessage = 'Connexion réussie !';
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('role', this.roleEntree);

            // Redirigez l'utilisateur vers la page de tableau de bord après la connexion réussie
           

            // Effacez le message après quelques secondes
            setTimeout(() => {
                this.successMessage = '';
                this.router.navigate(['/profile']);
            }, 1000);
           
        },
        (error) => {
          console.error(error);
          this.errorMessage = 'Une erreur dans les champs';
          setTimeout(() => {
            this.errorMessage = '';
        },1000);
      }
      );
    } else {
        // Gérer le cas où les rôles ne correspondent pas
        this.errorMessage = 'erreur dans les champs.';
        setTimeout(() => {
            this.errorMessage = '';
        },1000);
    }
}
show: boolean = true;

  showPassword() {
    this.show = !this.show;
  }
  selectRole(role: string) {
    this.selectedRole = role;
}
isPasswordVisible: boolean = false;

togglePasswordVisibility(): void {
  this.isPasswordVisible = !this.isPasswordVisible;
}

}