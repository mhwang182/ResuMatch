import { Component, inject } from "@angular/core";
import { JobsListContainer } from "./jobs-list-container.component";
import { RouterLink } from "@angular/router";
import { TooltipModule } from "ng2-tooltip-directive";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'jobs-container',
    standalone: true,
    imports: [TooltipModule, JobsListContainer, RouterLink],
    template: `
    <div class="size-full flex flex-col space-y-2">
        <a 
            class="p-2 bg-emerald-500 rounded-md text-white w-fit font-semibold text-sm"
            [routerLink]="['add']"
            tooltip="Disabled for Demo"
            [display]=isDemoMode()
         >
            {{"Add Job"}}
        </a>

        <jobs-list-container class="flex-grow"/>
    </div>
    `
})

export class JobsContainer {

    private authService: AuthService = inject(AuthService);

    isDemoMode() {
        return this.authService.isDemoMode();
    }

}