import { Component, OnInit } from '@angular/core';
import { FloorService } from '../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.css']
})
export class RapportComponent implements OnInit {
  isLoggedIn: boolean;
  nbAlertes: number = 0;
  seenFilter: string = '';
  users: any[] = [];
  periodeFilter: string = '';
  alerteAChercher: any = undefined;
  loading: boolean = true;
  rapports: any[] = [];
  alertes: any[] = [];
  typeFilter: string = '';
  loadingPromise: Promise<any> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private floorService: FloorService,
    private authService: AuthService
  ) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnInit(): void {
    // Charger d'abord les utilisateurs
    this.authService.getAllusers().subscribe((users: any[]) => {
      this.users = users;
      // Une fois les utilisateurs chargés, charger les alertes
      this.loadAlertes();
    });
  }

  async loadAlertes(): Promise<void> {
    this.alertes = [];
    this.loading = true;

    // Attendre que les utilisateurs soient disponibles
    await this.waitForUsers();

    // Charger les alertes une fois que les utilisateurs sont disponibles
    let annee: number, mois: number;
    this.floorService.getAllAlertes().subscribe((alertes: any) => {
      alertes.forEach((alerte: any) => {
        if (alerte.type != 'maintenance' &&
          (alerte.type == this.typeFilter || this.typeFilter == '') &&
          (alerte.vu.toString() == this.seenFilter || this.seenFilter == '') &&
          (alerte.id == this.alerteAChercher || !this.alerteAChercher)) {

          if (alerte.dateAlerte) {
            annee = parseInt(alerte.dateAlerte.split('T')[0].split('-')[0]);
            mois = parseInt(alerte.dateAlerte.split('T')[0].split('-')[1]);
            alerte.dateAlerte = `${annee}/${mois}/${alerte.dateAlerte.split('T')[0].split('-')[2]} ${alerte.dateAlerte.split('T')[1].split(':')[0]}:${alerte.dateAlerte.split('T')[1].split(':')[1]}`;
          }

          if ((this.periodeFilter == 'mois' && mois == new Date().getMonth() + 1 && annee == new Date().getFullYear()) ||
            (this.periodeFilter == '') ||
            (this.periodeFilter == 'annee' && annee == new Date().getFullYear())) {

            if (alerte.userID) {
              alerte.user = this.users.find(user => user.id === alerte.userID);
            } else {
              alerte.user = this.users.find(user => user.Role === 'Moyen generaux');
            }

            this.floorService.getRapportsByAlerteId(alerte.id).subscribe((rapport: any[]) => {
              alerte.rapports = rapport;
              if (!this.alertes.find(al => al.id == alerte.id)) {
                this.alertes.push(alerte);
                this.nbAlertes++;
              }
            });
          }
        }
      });
      this.loading = false;
    });
  }

  waitForUsers(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.users.length > 0) {
        resolve();
      } else {
        setTimeout(() => {
          if (this.users.length > 0) {
            resolve();
          } else {
            resolve();
          }
        }, 1000); // Attendre 1 seconde avant de vérifier à nouveau
      }
    });
  }

  addTypeFilter(type: string) {
    this.alertes = [];
    this.typeFilter = type;
    this.loadAlertes();
  }

  addSeenFilter(state: string) {
    this.alertes = [];
    this.seenFilter = state;
    this.loadAlertes();
  }

  addPeriodeFilter(periode: string) {
    this.alertes = [];
    this.periodeFilter = periode;
    this.loadAlertes();
  }

  Chercher() {
    if (this.alerteAChercher) {
      this.alertes = [];
      this.loadAlertes();
    }
  }

  stopExecution(): void {
    if (this.loadingPromise !== null) {
      this.loadingPromise = Promise.resolve();
    }
  }

  goToRapportDetails(id: any) {
    this.router.navigate(['/rapport-details', id.alerte]);
  }

  userLast(id: number): string {
    for (const batiment of this.users) {
      if (batiment.id === id) {
        return batiment.last_name;
      }
    }
    throw new Error(`Aucun bâtiment trouvé avec l'ID ${id}`);
  }

  userFirst(id: number): string {
    for (const batiment of this.users) {
      if (batiment.id === id) {
        return batiment.first_name;
      }
    }
    throw new Error(`Aucun bâtiment trouvé avec l'ID ${id}`);
  }
}
