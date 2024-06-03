import { Component, OnInit } from '@angular/core';
import { FloorService } from '../service/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent {
  prediction:any;
  constructor(private route: ActivatedRoute, private router: Router,private floorService: FloorService, private authService: AuthService){ }
  predict() {
    const data = {
      year: 2024,
      month: 7,
      
    };

    this.floorService.predictConsumptionMois(data).subscribe(
      response => {
        this.prediction= response;
        console.log('Predicted Consumption:', response.predicted_consumption);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

}
