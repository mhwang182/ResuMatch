import { Component, computed, inject, Input } from "@angular/core";
import { Job } from "./job.type";
import { RouterLink } from "@angular/router";
import { JobsService } from "../../services/jobs.service";
import { CommonModule } from "@angular/common";
import { ModalService } from "../../services/modal.service";
import { ModalComponent } from "../../modal.component";
import { AuthService } from "../../services/auth.service";
import { TooltipModule } from "ng2-tooltip-directive";

@Component({
    selector: 'job-preview',
    standalone: true,
    imports: [RouterLink, CommonModule, TooltipModule],
    template: `
    <div class="border rounded-md h-32 flex flex-col shadow-sm">
        <div class="flex justify-between space-x-3 h-full p-3">
            <div class="flex space-x-3">
                <div class="flex justify-center items-center size-12 text-3xl font-bold text-gray-700 bg-gray-300 rounded-md shadow-sm">
                    <div>{{job.company[0].toUpperCase()}}</div>
                </div>
                <div class="h-full">
                    <div class="font-bold text-xl">
                        {{job.role}}
                    </div>
                    <div class="font-light">
                        {{job.company}}
                    </div>
                    <div class="font-light">
                        {{job.location}}
                    </div>
                </div>
            </div>
            <!-- <div>
                <div>
                    Description:
                </div>
                <div>
                    {{job.description}}
                </div>
            </div> -->
            <div class="flex flex-col justify-between h-full items-end">
                    <!-- <div class="font-bold">
                        Resume Match:
                    </div> -->
                <a class="bg-gray-300 p-2 text-gray-700 rounded-lg w-fit shadow-sm font-semibold text-sm" [routerLink]="['/home/match/', job.id]">
                    <span *ngIf="!job.resumeMatch">Find Match</span>
                    <span *ngIf="job.resumeMatch">View Match</span>
                </a>
                <div class="flex justify-end space-x-2">
                    <a class="text-emerald-500" [routerLink]="['/home/jobs/', job.id]">Details</a>
                    <a 
                        class="text-emerald-500 cursor-pointer" 
                        (click)="deleteJob()"
                        tooltip="Disabled for Demo"
                        [display]=isDemoMode()
                    >Delete</a>
                </div>
            </div>   
            
        </div>
        
    </div>
    `
})

export class JobPreview {

    @Input() job!: Job;

    private jobsService: JobsService = inject(JobsService);

    private modalService: ModalService = inject(ModalService);

    private authService: AuthService = inject(AuthService);

    isDemoMode() {
        return this.authService.isDemoMode();
    }

    deleteJob() {

        if (this.authService.isDemoMode()) {
            return;
        }

        this.modalService.setOpen();

        this.modalService.setMessage("Deleting this job will also delete all matches associated with it.")

        this.modalService.setButtonLabel("Delete");
        this.modalService.setHeading("Warning!")

        this.modalService.setAccept(() => {
            if (this.job.id) {
                this.jobsService.deleteJob(this.job.id);
            }
        })
    }
}