import { inject } from "@angular/core";
import { Router, CanActivateFn, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "./services/auth/auth-service";

// Got it from https://angular.dev/guide/routing/route-guards
export const authGuard: CanActivateFn = (
	_route: ActivatedRouteSnapshot, 
	_state: RouterStateSnapshot
) => {
	const authService = inject(AuthService);
	const router = inject(Router);

	if (authService.isLoggedIn()) {
		return true;
	}

	return router.createUrlTree(['/login']);
}