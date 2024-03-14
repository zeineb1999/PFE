import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToutesZonesComponent } from './toutes-zones.component';

describe('ToutesZonesComponent', () => {
  let component: ToutesZonesComponent;
  let fixture: ComponentFixture<ToutesZonesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToutesZonesComponent]
    });
    fixture = TestBed.createComponent(ToutesZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
