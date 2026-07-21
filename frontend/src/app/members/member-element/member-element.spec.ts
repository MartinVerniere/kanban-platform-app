import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberElement } from './member-element';

describe('MemberElement', () => {
  let component: MemberElement;
  let fixture: ComponentFixture<MemberElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberElement],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberElement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
