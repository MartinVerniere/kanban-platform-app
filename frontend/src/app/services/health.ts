import { Service } from '@angular/core';

interface HealthResponse {
	status: string;
}

@Service()
export class Health {
	
	async getHealthStatus(): Promise<HealthResponse> {
		const response = await fetch('http://localhost:3000/health');
		const data = await response.json();
		return data as HealthResponse;
	}
}
