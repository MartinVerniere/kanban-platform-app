import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../auth-service';
import { email, form, required, submit } from '@angular/forms/signals';

interface IRegister {
	username: string;
	email: string;
	password: string;
}

@Component({
	selector: 'app-register',
	imports: [],
	templateUrl: './register.html',
	styleUrl: './register.css',
})
export class Register {
	authService = inject(AuthService);

	registerModel = signal<IRegister>({
		username: '',
		email: '',
		password: '',
	});

	registerForm = form(this.registerModel, (fieldPath) => {
		required(fieldPath.username, { message: 'Username is required' });
		required(fieldPath.email, { message: 'Email is required' });
		email(fieldPath.email, { message: 'Must be a valid email format' });
		required(fieldPath.password, { message: 'Password is required' });
	});

	async onSubmit(event: Event) {
		event.preventDefault();

		submit(this.registerForm, async () => {
			this.authService.register(this.registerModel());
			this.resetForm();
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
