import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeschichtenComponent } from './geschichten.component';

describe('GeschichtenComponent', () => {
  let component: GeschichtenComponent;
  let fixture: ComponentFixture<GeschichtenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeschichtenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeschichtenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
