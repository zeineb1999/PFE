import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipementsConsommationsComponent } from './equipements-consommations.component';

describe('EquipementsConsommationsComponent', () => {
  let component: EquipementsConsommationsComponent;
  let fixture: ComponentFixture<EquipementsConsommationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipementsConsommationsComponent]
    });
    fixture = TestBed.createComponent(EquipementsConsommationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
