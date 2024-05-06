import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingsConsumptionComponent } from './buildings-consumption2.component';

describe('BuildingsConsumptionComponent', () => {
  let component: BuildingsConsumptionComponent;
  let fixture: ComponentFixture<BuildingsConsumptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildingsConsumptionComponent]
    });
    fixture = TestBed.createComponent(BuildingsConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
