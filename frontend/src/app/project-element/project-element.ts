import { Component, input } from '@angular/core';
import { Project } from '../services/projects-service';

@Component({
	selector: 'app-project-element',
	imports: [],
	templateUrl: './project-element.html',
	styleUrl: './project-element.css',
})
export class ProjectElement {
	project = input.required<Project>();
}
