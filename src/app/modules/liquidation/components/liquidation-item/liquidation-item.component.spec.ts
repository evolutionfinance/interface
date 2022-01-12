import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidationItemComponent } from './liquidation-item.component';

describe('LiquidationItemComponent', () => {
  let component: LiquidationItemComponent;
  let fixture: ComponentFixture<LiquidationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidationItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
