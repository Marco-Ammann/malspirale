import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalgeschichtenComponent } from './malgeschichten.component';

describe('MalgeschichtenComponent', () => {
  let component: MalgeschichtenComponent;
  let fixture: ComponentFixture<MalgeschichtenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MalgeschichtenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MalgeschichtenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
