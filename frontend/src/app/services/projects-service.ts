import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectModel } from '../project-form/project-form';

const API_URL = 'http://localhost:3000/api';

export interface Project {
	id: number;
	name: string;
	key: string;
	description: string | null;
	members: ProjectMember[]
}

export interface ProjectMember {
	id: number;
	role: 'ADMIN' | 'MEMBER';

	user: {
		id: number;
		username: string;
		email: string;
	};
}

@Service()
export class ProjectsService {
	private http = inject(HttpClient);

	getProjects(): Observable<Project[]> {
		return this.http.get<Project[]>(`${API_URL}/projects/`);
	}

	getProject(id: number): Observable<Project> {
		return this.http.get<Project>(`${API_URL}/projects/${id}`);
	}

	createProject(project: ProjectModel): Observable<Project> {
		return this.http.post<Project>(`${API_URL}/projects/`, project);
	}

	updateProject(id: number, project: Project): void { }

	deleteProject(id: number): void { }

	addMember(projectId: number, userId: number): void { }

	removeMember(projectId: number, userId: number): void { }
}
