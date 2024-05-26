import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterEquipementRemplacementComponent } from './ajouter-equipement-remplacement.component';

describe('AjouterEquipementRemplacementComponent', () => {
  let component: AjouterEquipementRemplacementComponent;
  let fixture: ComponentFixture<AjouterEquipementRemplacementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterEquipementRemplacementComponent]
    });
    fixture = TestBed.createComponent(AjouterEquipementRemplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
