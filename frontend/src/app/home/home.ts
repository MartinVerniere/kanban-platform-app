import { Component, inject } from '@angular/core';
import { Health } from '../services/health';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
	selector: 'app-home',
	imports: [RouterLink],
	templateUrl: './home.html',
	styleUrl: './home.css',
})
export class Home {
	private healthService = inject(Health);
	authService = inject(AuthService);

	onClick() {
		console.log('Checking health status...');

		this.healthService.getHealthStatus().subscribe({
			next: (response) => {
				console.log('Health status:', response);
			},
			error: (error) => {
				console.error('Error fetching health status:', error);
			}
		});
	}
}
