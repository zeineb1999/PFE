import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.css']
})
export class ForgetPassComponent implements OnInit {
  email?:string;
  code?:number;
  
  successMessage?: string;
  errorMessage?: string;
  
  
  constructor(private authService: AuthService, private router: Router) { }
  forgetPass() {
    this.code=12345;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !emailPattern.test(this.email)) {
      this.errorMessage = 'Email invalide';
      setTimeout(() => {
        this.errorMessage = ''; // Effacer le message après quelques secondes
        
      }, 1000); // 3000 millisecondes = 3 secondes
  
    }
    if (this.email && this.code) {
      this.authService.resetPassword(this.email,this.code).subscribe(response => {
        console.log(response)
        
        this.successMessage = 'Email envoyé verifier votre boite email  !';
        setTimeout(() => {
          if (this.code && this.email) {
            localStorage.setItem('verificationCode', this.code.toString());
            localStorage.setItem('verificationEmail', this.email.toString());
          
          }
          this.successMessage = ''; // Effacer le message après quelques secondes
        }, 1000); // 3000 millisecondes = 3 secondes
      },(error)  => {
        if (!this.email || !emailPattern.test(this.email)) {
          this.errorMessage = 'Email invalide';
          setTimeout(() => {
            this.errorMessage = ''; // Effacer le message après quelques secondes
            
          }, 1000); // 3000 millisecondes = 3 secondes
      
        }
        else {
          this.errorMessage = 'Email inexistant';
          setTimeout(() => {
          this.errorMessage = ''; // Effacer le message après quelques secondes
          
          }, 1000);
        }
      });
    }
  }

  ngOnInit(): void {}
}
