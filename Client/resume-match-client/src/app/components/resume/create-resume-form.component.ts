import { Component, inject, Input, signal, Signal, WritableSignal } from "@angular/core";
import { ResumeService } from "../../services/resume.service";
import { FormsModule } from "@angular/forms";
import { Resume } from "./resume.type";
import * as lzString from "lz-string";
import { MatchService } from "../../services/match.service";
import { NgIf } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'create-resume-form',
    standalone: true,
    imports: [FormsModule, NgIf],
    template: `
        <div class="w-full h-full mt-2 flex flex-col space-y-2">
            <div class="flex space-x-2">
                <div class="flex flex-col">
                    <label class="font-semibold">Name:</label>
                    <input 
                        type="text"
                        class="border border-slate-300 outline-none p-2 rounded-md focus:outline-none focus:border focus:border-emerald-500 font-light"
                        [(ngModel)]="name"
                    />
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold">Role:</label>
                    <input 
                        class="border border-slate-300 outline-none p-2 rounded-md focus:outline-none focus:border focus:border-emerald-500 font-light"
                        [(ngModel)]="role"
                    />
                </div>
            </div>
            <div>
                <label class="font-semibold">Description:</label>
                <textarea 
                    class="border border-slate-300 rounded-md w-full p-2
                    focus:outline-none focus:border focus:border-emerald-500
                    resize-none font-light
                    "
                    [(ngModel)]="description"
                ></textarea>
            </div>
            <div class="flex-grow flex flex-col space-y-2">
                <label class="font-semibold">Content:</label>
                <textarea 
                    class="border border-slate-300 rounded-md w-full p-2
                    focus:outline-none focus:border focus:border-emerald-500
                    resize-none flex-grow font-light
                    "
                    [(ngModel)]="content"
                ></textarea>
                <button 
                class="px-4 py-2 bg-emerald-500 rounded-md text-white w-fit"
                (click)="submitResume()"
                *ngIf="canUpdate()"
                >
                    Save
                </button>

            </div>
        </div>
    `

})
export class CreateResumeForm {

    @Input() resume!: Resume | undefined;

    private resumeService: ResumeService = inject(ResumeService);

    private matchService: MatchService = inject(MatchService);

    private authService: AuthService = inject(AuthService);

    private router: Router = inject(Router);

    canUpdate: WritableSignal<boolean> = signal(false);

    name: string = ""
    role: string = ""
    description: string = ""
    content: string = ""

    submitResume() {
        //if resume used in match, then disable  update. else allow update

        if (!this.resume) {
            this.resumeService.createResume(this.name, this.role, this.description, this.content).subscribe({
                next: (res) => {
                    this.router.navigate(['/home/resumes']);
                }
            });
            return;
        }

        if (this.canUpdate()) {

            this.resumeService.updateResume(this.resume.id, this.name, this.role, this.description, this.content);
        }
    }

    ngOnInit() {

        if (!this.resume) {
            this.canUpdate.update(() => true);
            return;
        }

        this.name = this.resume?.name || "";
        this.role = this.resume?.role || "";
        this.description = this.resume?.description || "";
        this.content = this.resume ? lzString.decompressFromUTF16(this.resume.content) : "";

        if (this.resume && !this.authService.isDemoMode()) {
            this.matchService.listByResumeId(this.resume?.id).subscribe({
                next: (res) => {
                    if (res.length == 0) {
                        this.canUpdate.update(() => true);
                    }
                }
            })
        }
    }

    // ngOnChanges() {
    //     this.name = this.resume?.name || "";
    //     this.role = this.resume?.role || "";
    //     this.description = this.resume?.description || "";
    //     this.content = this.resume ? lzString.decompressFromUTF16(this.resume.content) : "";

    //     if (this.resume) {
    //         this.matchService.listByResumeId(this.resume?.id).subscribe({
    //             next: (res) => {
    //                 if (res.length == 0) {
    //                     this.canUpdate.update(() => true);
    //                 }
    //             }
    //         })
    //     }

    // }
}