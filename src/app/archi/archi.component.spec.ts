import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiComponent } from './archi.component';

describe('ArchiComponent', () => {
  let component: ArchiComponent;
  let fixture: ComponentFixture<ArchiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArchiComponent]
    });
    fixture = TestBed.createComponent(ArchiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
