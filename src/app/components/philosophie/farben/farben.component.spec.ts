import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarbenComponent } from './farben.component';

describe('FarbenComponent', () => {
  let component: FarbenComponent;
  let fixture: ComponentFixture<FarbenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarbenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarbenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
