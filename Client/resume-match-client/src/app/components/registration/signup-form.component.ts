import { NgIf } from "@angular/common";
import { Component, inject, signal, WritableSignal } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'signup-form',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf],
    template: `
        <form 
            [formGroup]="signUpForm" 
            (ngSubmit)="onSubmit()"
            class="space-y-4"
        >

            <!-- <div class="flex flex-col space-y-2">
                <label for="firstname">Firstname</label>
                <input 
                    id="firstname" formControlName="firstname" 
                    class="border border-slate-300 outline-none p-2 rounded-md focus:outline-none focus:border-2 focus:border-emerald-500"
                />
                <div *ngIf="signUpForm.get('firstname')?.invalid && (signUpForm.get('firstname')?.touched || submitTried)">
                    <small 
                        class="text-red-500"
                        *ngIf="signUpForm.get('firstname')?.hasError('required')"
                    >
                        Firstname is required.
                    </small>
                </div>
            </div>

            <div class="flex flex-col space-y-2">
                <label for="lastname">Lastname</label>
                <input 
                    id="lastname" formControlName="lastname" 
                    class="border border-slate-300 outline-none p-2 rounded-md focus:outline-none focus:border-2 focus:border-emerald-500"
                />
                <div *ngIf="signUpForm.get('lastname')?.invalid && (signUpForm.get('lastname')?.touched || submitTried)">
                    <small 
                        class="text-red-500"
                        *ngIf="signUpForm.get('lastname')?.hasError('required')"
                    >
                        Lastname is required.
                    </small>
                </div>
            </div> -->
            <small  class="text-red-500" *ngIf="hasApiError()"> *Username or Email already in use</small>

            <div class="flex flex-col space-y-2">
                <label for="username">Username</label>
                <input 
                    id="username" formControlName="username" 
                    class="border border-slate-300 outline-none p-2 rounded-md focus:outline-none focus:border-2 focus:border-emerald-500"
                />
                <div *ngIf="signUpForm.get('username')?.invalid && (signUpForm.get('username')?.touched || submitTried)">
                    <small 
                        class="text-red-500"
                        *ngIf="signUpForm.get('username')?.hasError('required')"
                    >
                        Username is required.
                    </small>
                </div>
            </div>

            <div class="flex flex-col space-y-2">
                <label for="email">Email</label>
                <input 
                    id="email" formControlName="email" 
                    class="border border-slate-300 outline-none p-2 rounded-md focus:outline-none focus:border-2 focus:border-emerald-500"
                />
                <div *ngIf="signUpForm.get('email')?.invalid && (signUpForm.get('email')?.touched || submitTried)">
                    <small class="text-red-500" *ngIf="signUpForm.get('email')?.hasError('required')">Email is required.</small>
                    <small class="text-red-500" *ngIf="signUpForm.get('email')?.hasError('email')">Invalid email format.</small>
                </div>
            </div>

            <div class="flex flex-col space-y-2">
                <label for="password">Password</label>
                <input 
                    type="password" id="password" formControlName="password"
                    class="border border-slate-300 outline-none p-2 rounded-md focus:outline-none focus:border-2 focus:border-emerald-500" 
                />
                <div *ngIf="signUpForm.get('password')?.invalid && (signUpForm.get('password')?.touched || submitTried)">
                    <small class="text-red-500" *ngIf="signUpForm.get('password')?.hasError('required')">Password is required.</small>
                </div>
            </div>

            <button 
                type="submit"
                class="bg-emerald-500 px-5 py-2 rounded-lg 
                    text-slate-100  hover:brightness-90 
                    shadow-md text-lg
                "
            >
                Sign Up
            </button>
        </form>
    `
})

export class SignupForm {
    private fb: FormBuilder = inject(FormBuilder);

    submitTried = false

    private authService: AuthService = inject(AuthService);

    private router: Router = inject(Router);

    hasApiError: WritableSignal<boolean> = signal(false);

    signUpForm: FormGroup = this.fb.group({
        // firstname: ['', [Validators.required]],
        // lastname: ['', [Validators.required]],
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    })

    onSubmit(): void {
        this.submitTried = true

        if (this.signUpForm.invalid) {
            return;
        }

        const username = this.signUpForm.get('username')?.value
        const email = this.signUpForm.get('email')?.value
        const password = this.signUpForm.get('password')?.value

        this.authService.createUser(username, email, password).subscribe({
            next: (res) => {
                this.authService.setAccessToken(res.accessToken);
                this.authService.setRefreshToken(res.refreshToken);
                this.authService.initializeUserInfo();
                this.authService.isLoggedIn.update(() => true);
                this.router.navigate(['/home']);
                //     this.setRefreshToken(res.refreshToken);
                //     this.isLoggedIn.update(() => true);
            },
            error: (err) => {
                this.hasApiError.update(() => true);
            }
        })

    }
}