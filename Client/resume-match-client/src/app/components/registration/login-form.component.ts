import { NgIf } from "@angular/common";
import { Component, Inject, inject, signal, WritableSignal } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { single } from "rxjs";

@Component({
    selector: 'login-form',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf],
    template: `
        <form 
            [formGroup]="signUpForm" 
            (ngSubmit)="onSubmit()"
            class="space-y-4"
        >
            <small class="text-red-500" *ngIf="hasApiError()">*Email or Password Incorrect</small>
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
                Log In
            </button>
        </form>
    `
})

export class LoginForm {

    private authService: AuthService = inject(AuthService);

    private router: Router = inject(Router);

    private fb: FormBuilder = inject(FormBuilder);

    submitTried = false

    hasApiError: WritableSignal<boolean> = signal(false);

    signUpForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    })

    onSubmit(): void {
        this.submitTried = true

        if (this.signUpForm.invalid) {
            return;
        }

        const username = this.signUpForm.get('email')?.value
        const password = this.signUpForm.get('password')?.value

        this.authService.loginUser(username, password).subscribe({
            next: (res) => {
                this.authService.setAccessToken(res.accessToken);
                this.authService.setRefreshToken(res.refreshToken);
                this.authService.initializeUserInfo();
                this.authService.isLoggedIn.update(() => true);
                this.router.navigate(['/home']);
            },
            error: (err) => {
                this.hasApiError.update(() => true);
            }
        });

    }
}