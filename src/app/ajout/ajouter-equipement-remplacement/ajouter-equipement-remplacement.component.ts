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
  selector: 'app-ajouter-equipement-remplacement',
  templateUrl: './ajouter-equipement-remplacement.component.html',
  styleUrls: ['./ajouter-equipement-remplacement.component.css'],
  providers: [FloorService]
})
export class AjouterEquipementRemplacementComponent implements OnInit {
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
  equipementIdRemplacant!:number;
  zoneRoomId!: any;
  isLoggedIn: boolean;
  localName: string ='';
  localId: any;
  rapport!:number;
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
    this.equipementIdRemplacant = parseInt(this.route.snapshot.paramMap.get('id') || '')
    this.rapport=parseInt(this.route.snapshot.paramMap.get('rapport') || '')
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
      etat: 'ON',
      categorie: this.categorie,
      puissance: this.puissance,
     
      zoneE: this.zoneRoomId,
      rapport: this.rapport
    };
    console.log("equipementData: ",equipementData);
    this.floorService.addEquipementAjouter(equipementData).subscribe(
      (data: any) => {
        /* const equipementId = data.id;
        console.log("donnes histo  rapport",this.rapport,"equi remp",this.equipementIdRemplacant,equipementId);
        this.floorService.createHistoriqueRemplacement(this.rapport, "remplacer",this.equipementIdRemplacant,equipementId).subscribe(
          (data: any) => {
            console.log("done ",data);

          },
          (error) => {
            console.log(error);
          }
        ); */
    
   /*      this.floorService.generatePeriode(equipementId).subscribe(
          (data: any) => {
           
          },
          error => {
            console.log(error);
          }
        ) 
        console.log(data);
        this.equipements.push(data);
        this.router.navigateByUrl(`/zone-details/${this.zoneRoomId}`);*/
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