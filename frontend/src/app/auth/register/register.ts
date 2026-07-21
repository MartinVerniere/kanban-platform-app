import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth-service';

interface RegisterModel {
	username: string;
	email: string;
	password: string;
}

@Component({
	selector: 'app-register',
	imports: [FormField, RouterLink],
	templateUrl: './register.html',
	styleUrl: './register.css',
})
export class Register {
	authService = inject(AuthService);
	router = inject(Router);

	registerModel = signal<RegisterModel>({
		username: '',
		email: '',
		password: '',
	});
	error = signal<string | null>(null);

	registerForm = form(this.registerModel, (fieldPath) => {
		required(fieldPath.username, { message: 'Username is required' });
		required(fieldPath.email, { message: 'Email is required' });
		email(fieldPath.email, { message: 'Must be a valid email format' });
		required(fieldPath.password, { message: 'Password is required' });
	});

	async onSubmit(event: Event) {
		event.preventDefault();

		submit(this.registerForm, async () => {
			this.authService.register(this.registerModel()).subscribe({
				next: () => {
					this.resetForm();
					this.error.set(null);
					this.router.navigate(['/login']);
				},
				error: (response: HttpErrorResponse) => {
					const errorObject = response.error.error;
					console.log(errorObject);
					this.error.set(errorObject.message);
				}
			});
		});
	}

	resetForm() {
		this.registerModel.set({
			username: '',
			email: '',
			password: '',
		});
		this.registerForm().reset();
	}
}
