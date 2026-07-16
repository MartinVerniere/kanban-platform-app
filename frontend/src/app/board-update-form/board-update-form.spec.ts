import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardUpdateForm } from './board-update-form';

describe('BoardUpdateForm', () => {
  let component: BoardUpdateForm;
  let fixture: ComponentFixture<BoardUpdateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardUpdateForm],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardUpdateForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
