import { Component, inject } from '@angular/core';
import { Health } from './services/health';

@Component({
	selector: 'app-root',
	imports: [],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {
	private healthService = inject(Health);

	async onClick() {
		console.log('Checking health status...');
		const response = await this.healthService.getHealthStatus();
		console.log('Health status:', response.status);
	}
}
