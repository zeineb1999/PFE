import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreejsSceneComponent } from './threejs-scene.component';

describe('ThreejsSceneComponent', () => {
  let component: ThreejsSceneComponent;
  let fixture: ComponentFixture<ThreejsSceneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreejsSceneComponent]
    });
    fixture = TestBed.createComponent(ThreejsSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
