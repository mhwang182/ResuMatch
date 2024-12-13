import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGaurd implements CanActivate {

    private authService: AuthService = inject(AuthService);

    private router: Router = inject(Router);

    constructor() {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        if (this.authService.hasTokens() || this.authService.isDemoMode()) {
            return true;
        }
        return this.router.navigate(['/']);
    }

} 