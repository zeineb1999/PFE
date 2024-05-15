
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changer-password',
  templateUrl: './changer-password.component.html',
  styleUrls: ['./changer-password.component.css']
})
export class ChangerPasswordComponent  implements OnInit {
  

  successMessage?: string;
  uidb64?: string;
  token?: string;
  newPassword?: string;

  constructor(private authService: AuthService, private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
      this.uidb64 = params['uidb64'];
      this.token = params['token'];
    });
  }

  NewPassword() {
    if (this.newPassword && this.uidb64 && this.token) {
      
      this.authService.changerPassword(this.uidb64, this.token, this.newPassword ).subscribe(response => {
        console.log(response)
       
        this.successMessage = 'Mot de passe changé !';
        setTimeout(() => {
         
          this.successMessage = ''; // Effacer le message après quelques secondes
          this.router.navigate(['/login']); // Redirigez l'utilisateur vers la page de tableau de bord après la connexion réussie
        }, 1000); // 3000 millisecondes = 3 secondes
      });
      
    }
    
  }
}
/*import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changer-password',
  templateUrl: './changer-password.component.html',
  styleUrls: ['./changer-password.component.css']
})
export class ChangerPasswordComponent  implements OnInit {
  
  password?: number;
  successMessage?: string;
  emailValide?: string;

  constructor(private authService: AuthService, private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    
    const storedEmail = sessionStorage.getItem('verificationEmail');
    if (storedEmail) {
      this.emailValide = storedEmail;
    }
  }

  NewPassword() {
    if (this.emailValide && this.password) {
      
      this.authService.changerPassword(this.emailValide,this.password).subscribe(response => {
        console.log(response)
       
        this.successMessage = 'Mot de passe changé !';
        setTimeout(() => {
         
          this.successMessage = ''; // Effacer le message après quelques secondes
          this.router.navigate(['/login']); // Redirigez l'utilisateur vers la page de tableau de bord après la connexion réussie
        }, 1000); // 3000 millisecondes = 3 secondes
      });
      
    }
    
  }
}
*/
