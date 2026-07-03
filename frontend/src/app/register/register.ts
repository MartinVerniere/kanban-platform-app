import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../auth-service';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';

interface RegisterModel {
	username: string;
	email: string;
	password: string;
}

@Component({
	selector: 'app-register',
	imports: [FormField],
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
			console.log('Registering user:', this.registerModel());
			this.authService.register(this.registerModel()).subscribe({
				next: (response) => {
					console.log('User registered successfully:', response);
					this.resetForm();
					this.error.set(null);
					this.router.navigate(['/login']);
				},
				error: (error) => {
					console.error('Error registering user:', error);
					this.error.set(error.error.message);
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
