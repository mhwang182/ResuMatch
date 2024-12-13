import { Component, inject, Input } from "@angular/core";
import { JobsService } from "../../services/jobs.service";
import { FormsModule } from "@angular/forms";
import { Job } from "./job.type";
import * as lzString from "lz-string";
import { NgIf } from "@angular/common";
import { Router } from "@angular/router";

@Component({
    selector: 'create-job-form',
    standalone: true,
    imports: [FormsModule, NgIf],
    template: `
        <div class="w-full h-full flex flex-col space-y-2">
            <div class="flex space-x-2">
                <div class="flex flex-col">
                    <label class="font-semibold">Role:</label>
                    <input 
                        class="border border-slate-300 outline-none p-2 rounded-md focus:outline-none focus:border focus:border-emerald-500 font-light"
                        [value]="role"
                        [(ngModel)]="role"
                        />
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold">Company:</label>
                    <input 
                        class="border border-slate-300 outline-none p-2 rounded-md focus:outline-none focus:border focus:border-emerald-500 font-light"
                        [(ngModel)]="company"
                        />
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold">Location:</label>
                    <input 
                        class="border border-slate-300 outline-none p-2 rounded-md focus:outline-none focus:border focus:border-emerald-500 font-light"
                        [(ngModel)]="location"
                        />
                </div>
            </div>
            <div class="flex-grow flex flex-col space-y-2">
                <label class="font-semibold">Description:</label>
                <textarea 
                    class="border border-slate-300 rounded-md w-full p-2
                    focus:outline-none focus:border focus:border-emerald-500
                    resize-none flex-grow font-light
                    "
                    [(ngModel)]="description"
                    *ngIf="!small"
                ></textarea>
                <textarea 
                    class="border border-slate-300 rounded-md w-full p-2
                    focus:outline-none focus:border focus:border-emerald-500 font-light
                    "
                    [(ngModel)]="description"
                    *ngIf="small"
                ></textarea>
                
                <button 
                class="px-4 py-2 bg-emerald-500 rounded-md text-white w-fit"
                (click)="createJob()"
                *ngIf="jobInput == undefined && !disableSave"
                >
                    Save
                </button>
            </div>
        </div>
    `
})
export class CreateJobForm {

    private jobsService: JobsService = inject(JobsService);

    private router: Router = inject(Router);

    @Input() jobInput!: Job | undefined;

    @Input() small: boolean = false;

    @Input() disableSave: boolean = false;

    role: string = "";
    company: string = "";
    description: string = "";
    location: string = "";


    ngOnChanges() {
        this.role = this.jobInput ? this.jobInput.role : "";
        this.company = this.jobInput ? this.jobInput.company : "";
        this.description = this.jobInput ? lzString.decompressFromUTF16(this.jobInput.jobDescription) : "";
        this.location = this.jobInput ? this.jobInput.location : "";
    }

    createJob() {
        this.jobsService.createJob({
            role: this.role,
            company: this.company,
            description: this.description,
            location: this.location
        }).subscribe({
            next: (res) => {
                this.router.navigate(['/home/jobs'])
            }
        });
    }

}