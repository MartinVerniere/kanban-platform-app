import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: (req: HttpRequest<unknown>) => any) => {
	const authService = inject(AuthService);
	const authToken: string | null = authService.getToken();

	if (authToken) {
		const authReq: HttpRequest<unknown> = request.clone({
			setHeaders: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		return next(authReq);
	}

	return next(request);
};
