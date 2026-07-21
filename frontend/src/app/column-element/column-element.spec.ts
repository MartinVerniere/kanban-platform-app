import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnElement } from './column-element';

describe('ColumnElement', () => {
  let component: ColumnElement;
  let fixture: ComponentFixture<ColumnElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnElement],
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnElement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
