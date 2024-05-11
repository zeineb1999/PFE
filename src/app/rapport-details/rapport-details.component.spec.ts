import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportDetailsComponent } from './rapport-details.component';

describe('RapportDetailsComponent', () => {
  let component: RapportDetailsComponent;
  let fixture: ComponentFixture<RapportDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RapportDetailsComponent]
    });
    fixture = TestBed.createComponent(RapportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
