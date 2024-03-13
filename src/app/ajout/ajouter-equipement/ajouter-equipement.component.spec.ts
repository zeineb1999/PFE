import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterEquipementComponent } from './ajouter-equipement.component';

describe('AjouterEquipementComponent', () => {
  let component: AjouterEquipementComponent;
  let fixture: ComponentFixture<AjouterEquipementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterEquipementComponent]
    });
    fixture = TestBed.createComponent(AjouterEquipementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
