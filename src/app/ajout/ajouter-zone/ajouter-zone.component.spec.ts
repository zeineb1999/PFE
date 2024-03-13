import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterZoneComponent } from './ajouter-zone.component';

describe('AjouterZoneComponent', () => {
  let component: AjouterZoneComponent;
  let fixture: ComponentFixture<AjouterZoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterZoneComponent]
    });
    fixture = TestBed.createComponent(AjouterZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
