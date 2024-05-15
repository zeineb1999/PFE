import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FloorService } from '../../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';

interface Equipement {
  nom?: string;
  etat: string;
  categorie: string;
  puissance: number;
  maxConsommation: number;
  minConsommation: number;
  zoneId: number;
}

interface Zone {
  id: number;
  nomLocal: string;
}

@Component({
  selector: 'app-ajouter-equipement',
  templateUrl: './ajouter-equipement.component.html',
  styleUrls: ['./ajouter-equipement.component.css'],
  providers: [FloorService]
})
export class AjouterEquipementComponent implements OnInit {
  zones: Zone[] = [];
  equipements: Equipement[] = [];
  selectedEquipements: any;
  selectedZones: any;
  nom!: string;

  etat!: string;
  categorie!: string;

  puissance!: number;
  maxConsommation!: number;
  minConsommation!: number;
  zoneId!: number;

  zoneRoomId!: any;
  isLoggedIn: boolean;
  localName: string ='';

  constructor(
    private floorService: FloorService,
    private router: Router, // Injecter Router
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private el: ElementRef
  ) { this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    this.getZones();
  }

  ngOnInit() {
    this.zoneRoomId = parseInt(this.route.snapshot.paramMap.get('zoneId') || '');

    this.floorService.getOneZone(this.zoneRoomId).subscribe(
      (data: any) => {
        this.localName = data.nomLocal;
        this.el.nativeElement.querySelector('#local-name').innerHTML = '<span class="inline-block bg-gradient-to-r from-blue-500 to-green-400 text-transparent bg-clip-text font-bold">'+this.localName+'</span>'
      },
      error => {
        console.log(error);
      }
    );

  }

  ngOnChanges() {
  }


  getZones = () => {
    this.floorService.getAllZones().subscribe(
      (data: Zone[]) => {
        this.zones = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  ajouterEquipement() {
    const equipementData = {
      nom: this.nom,
      etat: 'OFF',
      categorie: this.categorie,
      puissance: this.puissance,
      maxConsommation: this.maxConsommation,
      minConsommation: this.minConsommation,
      zoneE: this.zoneRoomId
    };

    this.floorService.addEquipement(equipementData).subscribe(
      (data: Equipement) => {
        console.log(data);
        this.equipements.push(data);
        this.router.navigateByUrl(`/zone-details/${this.zoneRoomId}`);
      },
      error => {
        console.log(error);
      }
    );
  }
}