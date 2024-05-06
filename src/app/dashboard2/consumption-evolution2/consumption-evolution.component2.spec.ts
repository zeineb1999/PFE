import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionEvolutionComponent } from './consumption-evolution2.component';

describe('ConsumptionEvolutionComponent', () => {
  let component: ConsumptionEvolutionComponent;
  let fixture: ComponentFixture<ConsumptionEvolutionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumptionEvolutionComponent]
    });
    fixture = TestBed.createComponent(ConsumptionEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
