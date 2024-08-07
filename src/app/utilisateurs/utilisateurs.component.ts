import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FloorService } from '../service/floor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.css']
})
export class UtilisateursComponent implements OnInit {
  

  user: any;
  alertes: any[] = [];
  rapports: any[] = [];
  utilisateurs: any[] = [];quipements: any[] = [];
  actions: any[] = [];
  etages: any[] = [];
  userRole: any;
  newUsername: string = '';
  newFirstname: string = '';
  newLastname: string = '';
  newEmail: string = '';
  code :number = 0;
  role: string='';
  codeValide: number = 0;
  isLoggedIn: boolean;
  errorMessage?: string;
  successMessage?: string;
  demandeModificationUsername: boolean = false;
  demandeModificationLastname: boolean = false; // modifier lastname
  demandeModificationFirstname: boolean = false;
  demandeModificationEmail: boolean = false;
  demandeCodeEmail: boolean = false;
  roles: string[] = [];
  rolesChoice:string="";
  boolChangement:boolean=false;
  userChange:number=0;
  newRole:string="";


  constructor(private authService: AuthService, private router: Router, private floorService : FloorService) {this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; }

  ngOnInit(): void {
    
    this.floorService.getAllHistoriqueUsers().subscribe(users => {
      this.actions=users;
    })
    this.floorService.getAllRapports().subscribe(rapports => {
      this.rapports = rapports;
    })
    this.authService.getAllusers().subscribe(users => {
      this.utilisateurs = users;
      //console.log(this.utilisateurs);
    })
  
    this.floorService.getAllAlertes().subscribe(alertes=> {
      this.alertes = alertes;
      
    })
    this.floorService.getAllEtages().subscribe(etages=> {
      this.etages = etages;
     
    })
    
    this.authService.getProfile().subscribe(profile => {
      this.user = profile;
      //console.log(this.user);
      //console.log('id : ',this.user.id);
      if(this.user && this.user.id){
        this.authService.getRole(this.user.id).subscribe(response => {
          this.userRole=response;
          this.role = this.userRole.role;
          sessionStorage.setItem('role', this.role);
          sessionStorage.setItem('id', this.user.id);
        }) 
      }
  });

  this.getRoles();
  }
  dateFormate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formate la date selon les paramètres régionaux
  }

  timeFormate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formate l'heure selon les paramètres régionaux
  }
  addUser() {
    this.router.navigate(['/signup']);
    
  }
 
  getRoles(): void {
    this.utilisateurs.forEach(utilisateur => {
      this.authService.getRole(utilisateur.id).subscribe(response => {
        this.roles.push(response.role);
      });
    });
  }
/*   deleteUser(id: number) {
    this.authService.deleteUser(id).subscribe(() => {
      window.location.reload();
  });
  }
  deleteBatiment(id: number) {
    this.floorService.deleteBatiment(id).subscribe(() => {
      window.location.reload();
  });
  }
  deleteEquipement(id: number) {
    this.floorService.deleteEquipement(id).subscribe(() => {
      window.location.reload();
  });
  } */
  updateProfile() {
    if( !this.newFirstname)
    {
      
      this.newFirstname = this.user.firstname;
    }
    if(!this.newLastname )
    { 
      this.newLastname = this.user.lastname;
    }
    if( !this.newUsername)
    {
     
      this.newUsername = this.user.username;
    }
    if( !this.newEmail)
      {
       
        this.newEmail = this.user.email;
      }
    //console.log(this.newUsername, this.newFirstname, this.newLastname);
    this.authService.updateUserProfile(this.newUsername, this.newFirstname, this.newLastname,this.newEmail)
      .subscribe(response => {
        this.successMessage = 'Modification effectuée !';
        setTimeout(() => {
          sessionStorage.setItem('isLoggedIn', 'true');
          this.successMessage = ''; // Effacer le message après quelques secondes
         }, 1000); 
         });
  }
  SeDeconnecter() {
    this.authService.logout();
    
  }
  onRoleChange(event: any, user: any): void {
    const newRole = event.target.value;
    //console.log("changmeent role",user.id , newRole)
    // Appel de la méthode pour mettre à jour le rôle de l'utilisateur
    this.updateUserRole(user.id, newRole);
  }
  updateUserRole(id:any,newRole:any){
    this.userChange=id;
    this.newRole=newRole;
    this.boolChangement=true;

    

  }
  confirmerChangementRole(){
    this.floorService.ChangerRole(this.userChange,this.newRole).subscribe(response=>{
      
      this.boolChangement=false;
      window.location.reload();
    })

  }
  annulerChangementRole(){
    this.boolChangement=false;
  }
  // modifier username
  modifierUsername() {
    this.demandeModificationUsername = true;
    
  }
  confirmerModifierUsername() {
    this.authService.updateUserProfile(this.newUsername, this.user.firstname, this.user.lastname,this.user.email)
      .subscribe(response => {
       
      window.location.reload();
    },
    (error)  => {
        this.errorMessage = 'Username existe deja';
        setTimeout(() => {
          this.errorMessage = ''; // Effacer le message après quelques secondes
          
        }, 1000); // 3000 millisecondes = 3 secondes
    
      });
    this.demandeModificationUsername = false;
    

  }
  annulerModificationUsername() {
    this.demandeModificationUsername = false;
  }
  
  // modifier lastname
  modifierLastname() {
    this.demandeModificationLastname = true;
    
  }
  confirmerModifierLastname() {
    this.authService.updateUserProfile(this.user.username, this.user.firstname, this.newLastname,this.user.email)
      .subscribe(response => {
       
      window.location.reload();
    });
    this.demandeModificationLastname = false;
    

  }
  annulerModificationLastname() {
    this.demandeModificationLastname = false;
  }
  // modifier firstname
  modifierFirstname() {
    
    this.demandeModificationFirstname = true;
    
  }
  confirmerModifierFirstname() {
    this.authService.updateUserProfile(this.user.username, this.newFirstname, this.user.lastname,this.user.email)
      .subscribe(response => {
       
      window.location.reload();
    });
    this.demandeModificationFirstname = false;
    

  }
  annulerModificationFirstname() {
    this.demandeModificationFirstname = false;
  }
  // modifier email
  modifierEmail() {
    
    this.demandeModificationEmail = true;
    
  }
  modifierPassword() {

    this.router.navigate(['/forgetPassword']);
  }
  generateRandomCode(): number {
    const min = 100000; // Le plus petit nombre à 6 chiffres
    const max = 999999; // Le plus grand nombre à 6 chiffres
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  confirmerModifierEmail() {
    this.demandeModificationEmail = false;
    this.demandeCodeEmail = true;
    this.codeValide = this.generateRandomCode();
    this.floorService.sendCode(this.newEmail, this.codeValide).subscribe(response => {

     
    });
   

  }
  annulerModificationEmail() {
    this.demandeModificationEmail = false;
  }
  confirmerCodeEmail() {
    if(this.code==this.codeValide){
    this.authService.updateUserProfile(this.user.username, this.user.firstname, this.user.lastname,this.newEmail)
      .subscribe(response => {
       
      window.location.reload();
    });
    this.demandeCodeEmail = false;
    }
    
  }
  annulerCodeEmail() {
    this.demandeCodeEmail = false;
  }
}


