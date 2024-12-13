import { Component, inject } from "@angular/core";
import { ResumeListContainer } from "./resume-list-container.component";
import { RouterLink } from "@angular/router";
import { TooltipModule } from "ng2-tooltip-directive";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'resume-list-content',
    standalone: true,
    imports: [ResumeListContainer, RouterLink, TooltipModule],
    template: `
        <div class="size-full flex flex-col">
            <a 
                class="p-2 bg-emerald-500 rounded-md text-white w-fit font-semibold text-sm"
                [routerLink]="['/home/resumes/add']"
                tooltip="Disabled for Demo"
                [display]=isDemoMode()
            >
                {{"Add Resume"}}
            </a>

            <resume-list-container class="flex-grow"/>
        </div>
    `
})

export class ResumeListContent {

    private authService: AuthService = inject(AuthService);

    isDemoMode() {
        return this.authService.isDemoMode();
    }
}