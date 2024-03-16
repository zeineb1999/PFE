import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateZoneComponent } from './update-zone.component';

describe('UpdateZoneComponent', () => {
  let component: UpdateZoneComponent;
  let fixture: ComponentFixture<UpdateZoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateZoneComponent]
    });
    fixture = TestBed.createComponent(UpdateZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
