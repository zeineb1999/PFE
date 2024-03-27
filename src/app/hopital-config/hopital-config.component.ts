import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-hopital-config',
  templateUrl: './hopital-config.component.html',
  styleUrls: ['./hopital-config.component.css']
})
export class HopitalConfigComponent {
  hopitalForm: FormGroup;
  addRoomForm: FormGroup;
  rooms: any[][] = [];

  constructor(private formBuilder: FormBuilder) {
    this.hopitalForm = this.formBuilder.group({
      numFloors: ['', Validators.required],
      firstFloorWidth: ['', Validators.required],
      firstFloorHeight: ['', Validators.required]
    });

    this.addRoomForm = this.formBuilder.group({
      roomWidth: ['', Validators.required],
      roomHeight: ['', Validators.required]
    });
  }

  onSubmit() {
    const width = this.hopitalForm.value.firstFloorWidth;
    const height = this.hopitalForm.value.firstFloorHeight;
  
    // Populate the rooms array based on the width and height of the first floor
    this.rooms = [];
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        row.push({ isRoom: 0 }); // Initialize all cells as not part of a room
      }
      this.rooms.push(row);
    }
  }
  

  addRoom() {
    const width = this.addRoomForm.value.roomWidth;
    const height = this.addRoomForm.value.roomHeight;

    // Update the rooms matrix to mark the cells of the added room
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        this.rooms[i][j].isRoom = 1;
      }
    }

    // Reset the form
    this.addRoomForm.reset();
  }

  removeRoom(index: number) {
    // Remove room logic
  }
}
