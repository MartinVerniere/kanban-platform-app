import { Component, inject, signal } from '@angular/core';
import { form, required, email, submit } from '@angular/forms/signals';
import { AuthService } from '../auth-service';

interface ILogin {
	username: string;
	password: string;
}

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
	authService = inject(AuthService);

	loginModel = signal<ILogin>({
		username: '',
		password: '',
	});

	loginForm = form(this.loginModel, (fieldPath) => {
		required(fieldPath.username, { message: 'Username is required' });
		required(fieldPath.password, { message: 'Password is required' });
	});

	async onSubmit(event: Event) {
		event.preventDefault();

		submit(this.loginForm, async () => {
			this.authService.login(this.loginModel());
			this.resetForm();
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
