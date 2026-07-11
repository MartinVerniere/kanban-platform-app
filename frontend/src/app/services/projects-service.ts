import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectModel } from '../project-form/project-form';

const API_URL = 'http://localhost:3000/api/projects';

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
		return this.http.get<Project[]>(`${API_URL}`);
	}

	getProject(id: number): Observable<Project> {
		return this.http.get<Project>(`${API_URL}/${id}`);
	}

	createProject(project: ProjectModel): Observable<Project> {
		return this.http.post<Project>(`${API_URL}/`, project);
	}

	updateProject(id: number, project: Project): void { }

	deleteProject(id: number): Observable<Project> {
		return this.http.delete<Project>(`${API_URL}/${id}`,)
	}

	addMember(projectId: number, userId: number): Observable<void> {
		return this.http.post<void>(`${API_URL}/${projectId}/members`, { userId: userId });
	}

	removeMember(projectId: number, userId: number): Observable<void> {
		return this.http.delete<void>(`${API_URL}/${projectId}/members/${userId}`);
	}
}
