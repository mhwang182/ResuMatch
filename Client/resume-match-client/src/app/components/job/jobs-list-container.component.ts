import { Component, inject, signal, WritableSignal } from "@angular/core";
import { JobPreview } from "./job-preview.component";
import { JobsService } from "../../services/jobs.service";
import { NgFor } from "@angular/common";
import { Job } from "./job.type";
import { AuthService } from "../../services/auth.service";
import { DemoService } from "../../services/demo.service";

@Component({
    selector: 'jobs-list-container',
    standalone: true,
    imports: [JobPreview, NgFor],
    template: `
        <div class="flex flex-wrap w-full gap-2">
            <job-preview class="w-full max-w-[49%]" *ngFor="let job of jobList()" [job]="job"/>
        </div>
    `
})
export class JobsListContainer {

    private jobsService: JobsService = inject(JobsService);

    private authService: AuthService = inject(AuthService);

    private demoService: DemoService = inject(DemoService);

    jobList: WritableSignal<Job[]> = signal([]);

    ngOnInit() {
        if (this.authService.isDemoMode()) {
            this.jobList = this.demoService.jobsList;
            return;
        }
        this.jobsService.getJobs();
        this.jobList = this.jobsService.jobsList;
    }

}