import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlerteDetailsComponent } from './alerte-details.component';

describe('AlerteDetailsComponent', () => {
  let component: AlerteDetailsComponent;
  let fixture: ComponentFixture<AlerteDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlerteDetailsComponent]
    });
    fixture = TestBed.createComponent(AlerteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
