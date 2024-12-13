import { Component, inject, signal, WritableSignal } from "@angular/core";
import { ResumePreview } from "./resume-preview.component";
import { ResumeService } from "../../services/resume.service";
import { Resume } from "./resume.type";
import { NgFor } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { Sign } from "crypto";
import { DemoService } from "../../services/demo.service";

@Component({
    selector: 'resume-list-container',
    standalone: true,
    template: `
        <div class="flex flex-wrap gap-3 mt-2">
            <resume-preview *ngFor="let resume of resumeList()" [resume]="resume"/>
        </div>
    `,
    imports: [ResumePreview, NgFor]
})
export class ResumeListContainer {

    private resumeService: ResumeService = inject(ResumeService);

    private authService: AuthService = inject(AuthService);

    private demoService: DemoService = inject(DemoService);

    resumeList: WritableSignal<Resume[]> = signal([]);

    ngOnInit() {
        if (this.authService.isDemoMode()) {
            this.resumeList = this.demoService.resumeList;
            return;
        }

        this.resumeService.getResumes();
        this.resumeList = this.resumeService.resumeList;

    }

}