import { Component, input } from '@angular/core';
import { Project } from '../../services/projects/project-service';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-project-element',
	imports: [RouterLink],
	templateUrl: './project-element.html',
	styleUrl: './project-element.css',
})
export class ProjectElement {
	project = input.required<Project>();
}
