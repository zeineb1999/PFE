import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipementDetailsComponent } from './equipement-details.component';

describe('EquipementDetailsComponent', () => {
  let component: EquipementDetailsComponent;
  let fixture: ComponentFixture<EquipementDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipementDetailsComponent]
    });
    fixture = TestBed.createComponent(EquipementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
