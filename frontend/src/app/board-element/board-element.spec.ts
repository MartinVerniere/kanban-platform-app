import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardElement } from './board-element';

describe('BoardElement', () => {
  let component: BoardElement;
  let fixture: ComponentFixture<BoardElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardElement],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardElement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
