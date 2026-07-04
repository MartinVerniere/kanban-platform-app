import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

interface LoginModel {
	username: string;
	password: string;
}

@Component({
	selector: 'app-login',
	imports: [FormField],
	templateUrl: './login.html',
	styleUrl: './login.css',
})
export class Login {
	authService = inject(AuthService);
	router = inject(Router);

	loginModel = signal<LoginModel>({
		username: '',
		password: '',
	});
	error = signal<string | null>(null);

	loginForm = form(this.loginModel, (fieldPath) => {
		required(fieldPath.username, { message: 'Username is required' });
		required(fieldPath.password, { message: 'Password is required' });
	});

	async onSubmit(event: Event) {
		event.preventDefault();

		submit(this.loginForm, async () => {
			this.authService.login(this.loginModel()).subscribe({
				next: (response) => {
					console.log('User logged in successfully:', response);
					this.resetForm();
					this.error.set(null);
					this.router.navigate(['/']);
				},
				error: (error) => {
					console.error('Error logging in user:', error);
					this.error.set(error.error.message);
				}
			});
		});
	}

	resetForm() {
		this.loginModel.set({
			username: '',
			password: '',
		});
		this.loginForm().reset();
	}
}
