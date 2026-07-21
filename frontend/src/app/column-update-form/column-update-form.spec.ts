import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnUpdateForm } from './column-update-form';

describe('ColumnUpdateForm', () => {
  let component: ColumnUpdateForm;
  let fixture: ComponentFixture<ColumnUpdateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnUpdateForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnUpdateForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
