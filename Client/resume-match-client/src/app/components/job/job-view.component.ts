import { Component, inject, Input, signal, WritableSignal } from "@angular/core";
import { CreateJobForm } from "./create-job-form.component";
import { JobsService } from "../../services/jobs.service";
import { Observable } from "rxjs";
import { Job } from "./job.type";
import * as lzString from "lz-string";
import { AuthService } from "../../services/auth.service";
import { DemoService } from "../../services/demo.service";

@Component({
    selector: 'job-view',
    standalone: true,
    imports: [CreateJobForm],
    template: `
        <create-job-form [jobInput]="job()"/>
    `
})
export class JobViewComponent {

    @Input() id!: number;

    private jobsService: JobsService = inject(JobsService);

    private authService: AuthService = inject(AuthService);

    private demoService: DemoService = inject(DemoService);

    job: WritableSignal<Job> = signal({ role: "", company: "", jobDescription: "", location: "" });

    ngOnInit() {

        const jobObservable: Observable<Job | undefined> = this.authService.isDemoMode() ?
            this.demoService.getJobObservable(this.id) :
            this.jobsService.getJob(this.id);

        jobObservable.subscribe({
            next: (res) => {
                this.job.update(() => res as Job);
            }
        })
    }

}