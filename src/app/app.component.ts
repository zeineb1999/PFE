import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { UserService } from './service/user.service';

import { TranslateService } from '@ngx-translate/core';
// Définir une interface pour l'objet de film
interface Movie {
  id: number;
  title: string;
  desc: string;
  year: number;
}
interface Registration {
  username: string;
  last_name:string;
  first_name:string;
  password: string;
  email: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ApiService, UserService]
})
export class AppComponent implements OnInit{

  selectedMovies :any  ;
  title = 'Frontend';
  afficherSide: Boolean = false;



  register: Registration = { // Initialiser la propriété register
    username: '',
    last_name:'',
    first_name:'',
    password: '',
    email: ''
  };
  ngOnInit() {
    var url = window.location.href;
    var pageName = url.substring(url.lastIndexOf('/') + 1);
    console.log(url, ": La page actuelle est : " + pageName);
    this.afficherSide = url!='http://localhost:4200/' && pageName != 'signup' && pageName != 'login' && pageName != '' && pageName != 'accueil'
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

  constructor(private userService: UserService, private api: ApiService, private translateService: TranslateService) {
    this.translateService.setDefaultLang('fr');
    this.translateService.use(sessionStorage.getItem('lang') || 'fr');
  }

}
