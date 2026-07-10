import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectElement } from './project-element';

describe('ProjectElement', () => {
  let component: ProjectElement;
  let fixture: ComponentFixture<ProjectElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectElement],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectElement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
