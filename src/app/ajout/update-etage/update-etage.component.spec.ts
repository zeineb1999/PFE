import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEtageComponent } from './update-etage.component';

describe('UpdateEtageComponent', () => {
  let component: UpdateEtageComponent;
  let fixture: ComponentFixture<UpdateEtageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateEtageComponent]
    });
    fixture = TestBed.createComponent(UpdateEtageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
