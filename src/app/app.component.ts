import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { UserService } from './service/user.service';
import { Router, NavigationEnd } from '@angular/router';
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

  constructor(private router: Router,private userService: UserService, private api: ApiService, private translateService: TranslateService) {
    this.translateService.setDefaultLang('fr');
    this.translateService.use(sessionStorage.getItem('lang') || 'fr');
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd)
        this.afficherSide = this.showSideBar(event.url)
    })
  }
  showSideBar(url: string): boolean {
    if (url.includes('forgetPassword') || url.includes('signup') || url.includes('accueil') || url=='/')
      return false
    return true

  }

}