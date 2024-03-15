import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutEquipementSansZoneComponent } from './ajout-equipement-sans-zone.component';

describe('AjoutEquipementSansZoneComponent', () => {
  let component: AjoutEquipementSansZoneComponent;
  let fixture: ComponentFixture<AjoutEquipementSansZoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutEquipementSansZoneComponent]
    });
    fixture = TestBed.createComponent(AjoutEquipementSansZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
