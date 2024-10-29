import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveOverviewComponent } from './reserve-overview.component';

describe('ReserveOverviewComponent', () => {
  let component: ReserveOverviewComponent;
  let fixture: ComponentFixture<ReserveOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReserveOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
