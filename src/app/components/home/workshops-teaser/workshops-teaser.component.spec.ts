import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopsTeaserComponent } from './workshops-teaser.component';

describe('WorkshopsTeaserComponent', () => {
  let component: WorkshopsTeaserComponent;
  let fixture: ComponentFixture<WorkshopsTeaserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopsTeaserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopsTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
