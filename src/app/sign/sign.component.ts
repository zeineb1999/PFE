import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FloorService } from '../service/floor.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class SignComponent {

  username: string = '';
  password: string = '';
  successMessage?: string;
  errorMessage?: string;
  selectedRole?: string;
  roleEntree: string = '';
  roleExact: string = '';
  id: any;
  roles = ['Responsable de maintenance', 'Moyens généraux', 'Administrateur', 'Responsable de l\'hôpital'];
  isRoleManuallySelected: boolean = false;

  constructor(private authService: AuthService,private floor :FloorService, private router: Router, private http: HttpClient) { }

  sign() {
    //console.log("role ", this.roleEntree);
    if (this.username) {
      this.authService.getId(this.username).subscribe(response => {
        this.roleExact = response.role;
        //console.log(this.roleExact);

        this.id=response.id
        // Maintenant que nous avons reçu le rôle exact, procédons à la connexion
        this.attemptLogin();
        this.floor.lancementSocket.next({role:this.roleEntree,id:this.id})
      });
    }
  }

  attemptLogin() {
    // Vérifions si le rôle entré correspond au rôle exact
    if (this.roleEntree == this.roleExact) {
      this.authService.login(this.username, this.password).subscribe(response => {
        //console.log(response.id);
        sessionStorage.setItem('token', response.access);
        this.successMessage = 'Connexion réussie !';
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('role', this.roleEntree);
        sessionStorage.setItem('id', this.id);

        // Redirigez l'utilisateur vers la page de tableau de bord après la connexion réussie
        setTimeout(() => {
          this.successMessage = '';
          if (this.roleEntree != 'admin') {
            if(this.roleEntree == 'Responsable de l\'hopital'){
              this.router.navigate(['/dashboard2']);
            }
            else{
              this.router.navigate(['/toutesZones']);
            }
            
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, 1000);
      },
        (error) => {
          console.error(error);
          this.errorMessage = 'Une erreur dans les champs';
          setTimeout(() => {
            this.errorMessage = '';
          }, 1000);
        }
      );
    } else {
      // Gérer le cas où les rôles ne correspondent pas
      this.errorMessage = 'erreur dans les champs.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 1000);
    }
  }

  show: boolean = true;

  showPassword() {
    this.show = !this.show;
  }



  isPasswordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  generateRoleUser() {
    if ( this.username ) {
      this.authService.getId(this.username).subscribe(response => {
        this.roleEntree = response.role;
      });
    }
  }

  generateRole() {
    if (this.username) {
      this.authService.getId(this.username).subscribe(response => {
        this.roleEntree = response.role;
      });
    }
  }
  selectRole(role: string) {
    this.roleEntree = role;
    this.isRoleManuallySelected = true;
  }
  
}
