import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResonanceColorsComponent } from './resonance-colors.component';

describe('ResonanceColorsComponent', () => {
  let component: ResonanceColorsComponent;
  let fixture: ComponentFixture<ResonanceColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResonanceColorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResonanceColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
