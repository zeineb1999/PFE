import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterZoneSansEtageComponent } from './ajouter-zone-sans-etage.component';

describe('AjouterZoneSansEtageComponent', () => {
  let component: AjouterZoneSansEtageComponent;
  let fixture: ComponentFixture<AjouterZoneSansEtageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterZoneSansEtageComponent]
    });
    fixture = TestBed.createComponent(AjouterZoneSansEtageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
