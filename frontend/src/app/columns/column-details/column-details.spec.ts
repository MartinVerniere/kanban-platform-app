import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnDetails } from './column-details';

describe('ColumnDetails', () => {
  let component: ColumnDetails;
  let fixture: ComponentFixture<ColumnDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
