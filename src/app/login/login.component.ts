import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { UserService } from '../service/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
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
  register: Registration = { // Initialiser la propriété register
    username: '',
    last_name:'',
    first_name:'',
    password: '',
    email: ''
  };
  ngOnInit(){
    this.register ={
      username : '',
      last_name:'',
      first_name:'',
      password : '',
      email : ''

    };
    
    
  }
  registerUser() {
    this.userService.registerNewUser(this.register).subscribe(
      response => {
        alert('User '+ this.register.username+ ' Has been created ')
      },
      error =>   console.log( 'error',error)
    );
  

  }
  constructor(private userService: UserService, private api: ApiService) {
    // Code du constructeur
 
    
  }
  

}
