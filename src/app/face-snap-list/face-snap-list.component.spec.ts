import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceSnapListComponent } from './face-snap-list.component';

describe('FaceSnapListComponent', () => {
  let component: FaceSnapListComponent;
  let fixture: ComponentFixture<FaceSnapListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaceSnapListComponent]
    });
    fixture = TestBed.createComponent(FaceSnapListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
