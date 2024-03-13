import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { UserService } from './service/user.service';


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
  movies: Movie[] = []; // Initialiser avec un tableau vide de films
  selectedMovies :any  ;
  title = 'Frontend';
  
  

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
 
    this.getMovies();
    this.selectedMovies={id: -1, title: '' , desc: '' , year: 0}
  }

  getMovies = () => {
    this.api.getALLMovies().subscribe(
      (data: Movie[]) => { // Spécifiez le type de données comme Movie[]
        this.movies = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  movieClicked = (movie: Movie) => { // Spécifiez le type de movie comme Movie
    this.api.getOneMovie(movie.id).subscribe(
      (data: Movie) => { // Spécifiez le type de données comme Movie
        console.log(data);
        this.selectedMovies = data; // Mettez à jour les propriétés du film sélectionné
       
      },
      error => {
        console.log(error);
      }
    );
  }
  updateMovie = () => {
    this.api.updateMovie( this.selectedMovies).subscribe(
      (data: Movie) => { // Spécifiez le type de données comme Movie
        this.getMovies();
      },
      error => {
        console.log(error);
      }
    );
  }
  createMovie = () => {
    this.api.createMovie( this.selectedMovies).subscribe(
      (data: Movie) => { // Spécifiez le type de données comme Movie
        console.log(data);
        this.movies.push(data); // Mettez à jour les propriétés du film sélectionné
       
      },
      error => {
        console.log(error);
      }
    );
  }
  deleteMovie = () => {
    this.api.deleteMovie( this.selectedMovies.id).subscribe(
      (data: Movie) => { // Spécifiez le type de données comme Movie
        this.getMovies();
      },
      error => {
        console.log(error);
      }
    );
  }
  floorSurface?: number;

  

  ajouterEtage() {
    if (this.floorSurface) {
      this.api.addFloor(this.floorSurface)
        .subscribe(response => {
          // Traitement en cas de succès, par exemple redirection ou actualisation des données
        }, error => {
          // Gérer les erreurs, par exemple afficher un message d'erreur à l'utilisateur
        });
    }
  }
}
