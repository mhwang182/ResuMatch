import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class UserInitializationService {

    constructor(private authService: AuthService) {
        if (localStorage.getItem('token') && localStorage.getItem('refreshToken')) {
            this.authService.initializeUserInfo();
        }
    }
}
