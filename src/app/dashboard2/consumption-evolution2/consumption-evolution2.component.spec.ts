import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionEvolution2Component } from './consumption-evolution2.component';

describe('ConsumptionEvolution2Component', () => {
  let component: ConsumptionEvolution2Component;
  let fixture: ComponentFixture<ConsumptionEvolution2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumptionEvolution2Component]
    });
    fixture = TestBed.createComponent(ConsumptionEvolution2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
