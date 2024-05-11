import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterBatimentComponent } from './ajouter-batiment.component';

describe('AjouterBatimentComponent', () => {
  let component: AjouterBatimentComponent;
  let fixture: ComponentFixture<AjouterBatimentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterBatimentComponent]
    });
    fixture = TestBed.createComponent(AjouterBatimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
