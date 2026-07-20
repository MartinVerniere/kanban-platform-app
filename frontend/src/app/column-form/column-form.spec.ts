import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnForm } from './column-form';

describe('ColumnForm', () => {
  let component: ColumnForm;
  let fixture: ComponentFixture<ColumnForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
