import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HopitalConfigComponent } from './hopital-config.component';

describe('HopitalConfigComponent', () => {
  let component: HopitalConfigComponent;
  let fixture: ComponentFixture<HopitalConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HopitalConfigComponent]
    });
    fixture = TestBed.createComponent(HopitalConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
