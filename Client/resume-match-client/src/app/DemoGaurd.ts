import { inject, Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, MaybeAsync, GuardResult, Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class DemoGaurd implements CanActivate {

    private authService: AuthService = inject(AuthService);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {

        return !this.authService.isDemoMode();

    }

} 