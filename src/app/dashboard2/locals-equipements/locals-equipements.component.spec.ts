import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalsEquipementsComponent } from './locals-equipements.component';

describe('LocalsEquipementsComponent', () => {
  let component: LocalsEquipementsComponent;
  let fixture: ComponentFixture<LocalsEquipementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocalsEquipementsComponent]
    });
    fixture = TestBed.createComponent(LocalsEquipementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
