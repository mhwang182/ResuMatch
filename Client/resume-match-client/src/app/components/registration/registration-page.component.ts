import { Component, inject, Input, OnInit } from "@angular/core";
import { SignupForm } from "./signup-form.component";
import { LoginForm } from "./login-form.component";
import { AuthService } from "../../services/auth.service";
import { TopBar } from "../top-bar.component";
import { RouterLink, RouterOutlet } from "@angular/router";
import { NgIf } from "@angular/common";

@Component({
    selector: 'app-registration',
    standalone: true,
    imports: [SignupForm, LoginForm, TopBar, RouterLink, NgIf],
    template: `
        <top-bar class="w-full absolute"/>
        <div class="w-full h-screen flex justify-center items-center">

            <div class="w-[400px] h-fit border border-slate-300 p-10 rounded-lg">
                
                @if(!getIsLoggedIn()()) {
                    <h2 class="w-full mx-auto text-xl font-semibold">Log In</h2>
                    <br />
                    <login-form *ngIf="type == 'login'"/>
                    <signup-form *ngIf="type == 'signUp'"/> 
                } @else {
                    <h2 class="w-full mx-auto text-xl font-semibold">Logged In!</h2>
                    <br />
                    <div class="flex gap-4">
                        <button 
                            class="bg-emerald-500 px-5 py-2 rounded-lg 
                                text-slate-100  hover:brightness-90 
                                shadow-md text-lg
                            "
                            (click)="logout()"
                        >
                            Log Out
                        </button>
                        <button 
                            class="bg-emerald-500 px-5 py-2 rounded-lg 
                                text-slate-100  hover:brightness-90 
                                shadow-md text-lg
                            "
                            [routerLink]="mainLink"
                        >
                            Content
                        </button>
                    </div>
                }
                 
                
            </div>
        </div>
    `
})

export class RegistrationPage {

    mainLink = "/home"

    @Input() type = "login"

    private authService: AuthService = inject(AuthService);

    logout() {
        this.authService.logout()
    }

    getIsLoggedIn() {
        return this.authService.isLoggedIn
    }

}