import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SignUpButton } from "./signup-button.component";
import { StandardButton } from "./standard-button.component";
import { TopBar } from './top-bar.component';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [SignUpButton, StandardButton, TopBar, RouterLink, NgIf],
    template: `
        <div class="flex flex-col items-center space-y-8 w-full">
            <top-bar class="w-full"/>
            <div class="flex flex-col items-center w-full">
                <p class="text-6xl font-extrabold text-slate-700">Choose the</p>
                <p class="text-6xl font-extrabold bg-gradient-to-r from-emerald-500 to-sky-500 text-transparent bg-clip-text h-16">Right Resume.</p>
                <p class="text-6xl font-extrabold text-slate-700">Land the Job You Deserve!</p>
            </div>
            <p class="text-2xl text-slate-500 font-light">Find the version of your resume that gives you the best chance of landing your next interview.</p>
            <div class="w-[600px] flex gap-4 justify-center">
                
                <signup-button [routerLink]="['/sign-up']" *ngIf="!isLoggedIn()"/>
                <standard-button [title]="'Login'" [routerLink]="['/login']" *ngIf="!isLoggedIn()"/>
                <standard-button [title]="'Enter'" [routerLink]="['/home']" *ngIf="isLoggedIn()"/>
                <standard-button [title]="'Demo'" (click)="startDemoMode()" *ngIf="!isLoggedIn()"/>

            </div>
        </div>
    `
})
export class HomeComponent {

    private authService: AuthService = inject(AuthService);

    private router: Router = inject(Router);

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    startDemoMode() {
        this.authService.switchToDemoMode()
        this.router.navigate(['/home'])
    }
}