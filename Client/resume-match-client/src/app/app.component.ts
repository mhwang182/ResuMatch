import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from "./modal.component";
import { AuthService } from './services/auth.service';
import { UserInitializationService } from './services/userInitialization.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FormsModule, ReactiveFormsModule, ModalComponent],
  template: `
    <modal class="w-screen h-screen"/>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'resume-match';

  private authService: AuthService = inject(AuthService);
  private userInitializationService = inject(UserInitializationService);
}
