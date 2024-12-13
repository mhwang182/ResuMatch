import { Component, inject, Input } from "@angular/core";
import { Resume } from "./resume.type";
import { RouterLink } from "@angular/router";
import { ResumeService } from "../../services/resume.service";
import { ModalService } from "../../services/modal.service";
import { TooltipModule } from "ng2-tooltip-directive";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'resume-preview',
    imports: [RouterLink, TooltipModule, CommonModule],
    standalone: true,
    template: `
        <div class="border w-60 p-4 rounded-sm shadow-sm flex flex-col justify-between hover:bg-gray-100 aspect-square">
            <div class="flex flex-col space-y-3">
                <div class="font-bold text-xl">{{resume.name}}</div>
                <!-- <div class="text-sm text-slate-500">{{resume.createdAt}}</div> -->
                <div class="font-light">{{resume.role}}</div>
                <div class="font-light">{{resume.description}}</div>
            </div>
            <div class="flex flex-row justify-between">
                <a [routerLink]="['/home/resumes/', resume.id]" class="text-emerald-500 text-sm">View/Edit</a>
                <a 
                    class="text-emerald-500 cursor-pointer text-sm" 
                    (click)="deleteResume()" 
                    tooltip="Disabled for Demo" 
                    [display]=isDemoMode()
                >Delete</a>
            </div>
        </div>
    `
})

export class ResumePreview {

    @Input() resume!: Resume;

    private resumeService: ResumeService = inject(ResumeService);

    private modalService: ModalService = inject(ModalService);

    private authService: AuthService = inject(AuthService);

    isDemoMode() {
        return this.authService.isDemoMode();
    }

    deleteResume() {
        // alert("Deleting this resume will delete all corresponding resume matches");

        if (this.authService.isDemoMode()) {
            return;
        }

        this.modalService.setOpen();

        this.modalService.setMessage("Deleting this Job will delete all corresponding matches.");
        this.modalService.setButtonLabel("Delete");
        this.modalService.setHeading("Warning!")

        this.modalService.setAccept(() => {
            this.resumeService.deleteResume(this.resume.id);
        });
    }
}