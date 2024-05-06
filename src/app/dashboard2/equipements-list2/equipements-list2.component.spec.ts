import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipementsListComponent } from './equipements-list2.component';

describe('EquipementsListComponent', () => {
  let component: EquipementsListComponent;
  let fixture: ComponentFixture<EquipementsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipementsListComponent]
    });
    fixture = TestBed.createComponent(EquipementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
