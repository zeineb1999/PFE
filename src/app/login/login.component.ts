import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { UserService } from '../service/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
interface Registration {
  username: string;
  last_name:string;
  first_name:string;
  password: string;
  email: string;
  
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ApiService, UserService]
})
export class LoginComponent implements OnInit{
  isLoggedIn: boolean;
  
  register: Registration = { // Initialiser la propriété register
    username: '',
    last_name:'',
    first_name:'',
    password: '',

    email: ''
  };
  role: string=''
  password2: string = '';
  ngOnInit(){
    this.role='';
    this.register ={
      username : '',
      last_name:'',
      first_name:'',
      password : '',
      email : ''

    };
  
    
  }
  show: boolean = true;

  showPassword() {
    this.show = !this.show;
  }

  registerUser() {
    if(this.password2 == this.register.password){
      this.userService.registerNewUser(this.register).subscribe(
        response => {
          const userId = response.id;
          console.log('User ID:', userId);
          this.userService.registerNewRole(userId, this.role).subscribe(
            response => {
              
            }
          )
          alert('User '+ this.register.username+ ' Has been created ');
          this.router.navigateByUrl('/utilisateurs')
          //this.router.navigateByUrl('/login')
        },
        error =>   console.log( 'error',error)
      );
    }
    else{
      alert('Password does not match');
    }
  

  }
  constructor(private userService: UserService, private api: ApiService,private route: ActivatedRoute, private router: Router) {
    // Code du constructeur
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    

  }
  

}