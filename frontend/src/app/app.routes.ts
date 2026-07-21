import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Register } from './register/register';
import { authGuard } from './auth.guard';
import { ProjectList } from './project-list/project-list';
import { ProjectDetails } from './project-details/project-details';
import { ProjectForm } from './project-form/project-form';
import { BoardForm } from './board-form/board-form';
import { BoardUpdateForm } from './board-update-form/board-update-form';
import { BoardDetails } from './board-details/board-details';
import { ColumnForm } from './column-form/column-form';
import { ColumnUpdateForm } from './column-update-form/column-update-form';

export const routes: Routes = [
	{
		path: '',
		component: Home,
		canActivate: [authGuard]
	},
	{
		path: 'login',
		component: Login
	},
	{
		path: 'register',
		component: Register
	},
	{
		path: 'projects',
		component: ProjectList
	},
	{
		path: 'projects/create',
		component: ProjectForm
	},
	{
		path: 'projects/:id',
		component: ProjectDetails
	},
	{
		path: 'projects/:id/boards/create',
		component: BoardForm,
	},
	{
		path: 'projects/:projectId/boards/:boardId',
		component: BoardDetails	
	},
	{
		path: 'projects/:projectId/boards/:boardId/edit',
		component: BoardUpdateForm
	},
	{
		path: 'projects/:projectId/boards/:boardId/columns/create',
		component: ColumnForm
	},
	{
		path: 'projects/:projectId/boards/:boardId/columns/:columnId/edit',
		component: ColumnUpdateForm
	}
];
