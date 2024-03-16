import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEquipementComponent } from './update-equipement.component';

describe('UpdateEquipementComponent', () => {
  let component: UpdateEquipementComponent;
  let fixture: ComponentFixture<UpdateEquipementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateEquipementComponent]
    });
    fixture = TestBed.createComponent(UpdateEquipementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
