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
  selectedCategory: string = ''; // Propriété pour stocker la catégorie sélectionnée

  categories = [
    { label: 'Réfrigérateurs et Congélateurs', value: 'Réfrigérateurs et Congélateurs' },
    { label: 'Equipements de bureaux', value: 'Equipements de bureaux' },
    { label: 'Equipements médicaux', value: 'Equipements médicaux' },
    { label: 'Equipements de cuisine', value: 'Equipements de cuisine' },
    { label: 'Prises à usage personnel', value: 'Prises à usage personnel' }
  ];
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
  type!:string;
  zoneRoomId!: any;
  isLoggedIn: boolean;
  localName: string ='';
  localId: any;

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
        this.localId = data.id
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
      type:this.selectedCategory,

      zoneE: this.zoneRoomId,
      minC: this.minConsommation,
      maxC: this.maxConsommation
    };
    console.log('categorie',this.selectedCategory)
    console.log("equipementData: ",equipementData);
    this.floorService.addEquipement(equipementData).subscribe(
      (data: any) => {
        const equipementId = data.id;
        this.floorService.generatePeriode(equipementId).subscribe(
          (data: any) => {
           
          },
          error => {
            console.log(error);
          }
        )
        console.log(data);
        this.equipements.push(data);
        this.router.navigateByUrl(`/zone-details/${this.zoneRoomId}`);
      },
      error => {
        console.log(error);
      }
    );
  }

  goBack() {
    window.history.back();
  }
}