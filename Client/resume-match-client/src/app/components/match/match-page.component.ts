import { Component, computed, inject, Input, Signal, signal, WritableSignal } from "@angular/core";
import { JobsService } from "../../services/jobs.service";
import { Job } from "../job/job.type";
import { Observable, of } from "rxjs";
import * as lzString from "lz-string";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { ResumeService } from "../../services/resume.service";
import { Resume } from "../resume/resume.type";
import { MatchService } from "../../services/match.service";
import { ResumeMatch } from "../../ResumeMatch.type";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { DemoService } from "../../services/demo.service";
import { TooltipModule } from "ng2-tooltip-directive";

@Component({
    selector: 'find-match-page',
    standalone: true,
    imports: [NgIf, CommonModule, NgFor, RouterLink, FormsModule, TooltipModule],
    template: `
        <div class="flex flex-col space-y-2">
            <div class="w-full h-full flex flex-col space-y-2" *ngIf="job$ | async; let job">
                <div class="flex space-x-6 bg-gray-100 rounded-lg p-2 shadow-sm border">
                    <div class="">
                        <label class="font-semibold">Role: </label>
                        <span class="font-light">{{job.role}}</span>
                    </div>
                    <div class="">
                        <label class="font-semibold">Company: </label>
                        <span class="font-light">{{job.company}}</span>
                    </div>
                    <div class="">
                        <label class="font-semibold">Location: </label>
                        <span class="font-light">{{job.location}}</span>
                    </div>
                </div>
                <div class="flex-grow flex flex-col space-y-2 bg-gray-100 border rounded-lg p-2 shadow-sm">
                    <label class="font-semibold">Description:</label>
                    <div class="whitespace-pre-wrap line-clamp-[8] font-light" *ngIf="!showCoverage">
                        {{decompress(job.jobDescription)}}
                    </div>
                    <div id="paragraph" class="whitespace-pre-wrap font-light" *ngIf="showCoverage">
                        {{decompress(job.jobDescription)}}
                    </div>
                    
                    <a [routerLink]="getJobLink(id)" class="text-emerald-500 w-fit cursor-pointer" *ngIf="!showCoverage">View More</a>
                    <a (click)="hideCoverage()" class="text-emerald-500 w-fit cursor-pointer" *ngIf="showCoverage">Back</a>
                </div>  
            </div>
            @if (!loading() && !showCoverage) {
                @if (resumeMatches().length > 0 && !showFind) {
                    <div class="flex flex-col p-2">
                        <span class="font-light">Current Resume Match: </span>
                        <div *ngFor="let matchResume$ of matchResumes()"
                            class=""
                        >       
                            <div class="flex space-x-3 px-2 py-4 border-b justify-between" *ngIf="matchResume$ | async; let matchResume">
                                <a class="text-emerald-500 w-1/4 hover:underline font-semibold" [routerLink]="[getResumeLink(matchResume.id)]">{{matchResume.name}}</a>
                                <div class="w-1/4 text-slate-700 font-light">{{matchResume.role}}</div>
                                <div class="w-1/4 text-end font-light">{{getDate(matchResume.createdAt)}}</div>
                                <a class="w-1/4 text-end font-light hover:underline cursor-pointer" (click)="getMatchKeywords()">View Coverage</a>
                            </div>
                        </div>
                        
                    </div>
                    <div class="flex space-x-2">
                            <button 
                                class="px-4 py-2 bg-emerald-500 rounded-md text-white w-fit text-sm cursor-pointer"
                                (click)="toggleFindMode()"
                            >
                                Find New Match
                            </button>
                            <button 
                                class="px-4 py-2 bg-emerald-500 rounded-md text-white w-fit text-sm cursor-pointer"
                                (click)="deleteMatch()"
                                tooltip="Disabled for Demo"
                                [display]=isDemoMode()
                            >
                                Delete Match
                            </button>
                        </div>
                } @else {
                    <div class="p-2">
                        <div class="flex flex-col" *ngIf="resumes$ | async; let resumesObj">
                            <span class="font-light">Resumes to Consider: </span>
                            <div class="flex space-x-3 px-2 py-4 border-b justify-between">
                                    <div></div>
                                    <div class="font-semibold w-1/4">Name:</div>
                                    <div class="w-1/4 font-semibold">Role: </div>
                                    <div class="w-1/4 font-semibold text-end">Created:</div>
                            </div>
                            <div *ngFor="let resume of resumesObj.resumes" 
                                class="flex space-x-3 px-2 py-4 border-b justify-between"
                            >
                                <input type="checkbox" (click)="addToSet(resume.id)">
                                <div class="text-emerald-500 font-light w-1/4">{{resume.name}}</div>
                                <div class="w-1/4 font-light text-slate-700">{{resume.role}}</div>
                                <div class="w-1/4 text-end font-light">{{getDate(resume.createdAt)}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex space-x-2" *ngIf="resumes$ | async;">
                        <button 
                            class="px-4 py-2 bg-emerald-500 rounded-md text-white w-fit text-sm"
                            (click)="findMatch()"
                            tooltip="Disabled for Demo"
                            [display]=isDemoMode()
                        >
                            Find Match
                        </button>
                        <button 
                            class="px-4 py-2 bg-emerald-500 rounded-md text-white w-fit text-sm"
                            (click)="toggleFindMode()"
                            *ngIf="resumeMatches().length > 0"
                        >
                            Cancel
                        </button>
                    </div>
                }
               
                
            } @else {
                <div *ngIf="!showCoverage">Loading...</div>
            }
        </div>
    `
})

export class MatchPageComponent {

    @Input() id!: number;

    private jobsService: JobsService = inject(JobsService);

    private resumeService: ResumeService = inject(ResumeService);

    private matchService: MatchService = inject(MatchService);

    private authService: AuthService = inject(AuthService);

    private demoService: DemoService = inject(DemoService);

    showCoverage: boolean = false;

    showFind: boolean = false;

    resumeIds: Set<number> = new Set();

    job$: Observable<Job | undefined> = new Observable();

    resumes$: Observable<{ resumes: Resume[] }> = new Observable();

    resumeMatches: WritableSignal<ResumeMatch[]> = signal([]);

    matchResumes: Signal<Observable<Resume>[]> = computed(() => {
        return this.resumeMatches()
            .filter(match => match.resumeId)
            .map(match => this.getResumeObservableById(match.resumeId));
    });

    loading: WritableSignal<boolean> = signal(false);

    isDemoMode() {
        return this.authService.isDemoMode();
    }

    getResumeObservableById(resumeId: number) {
        return this.authService.isDemoMode() ?
            this.demoService.getResumeObservable(resumeId) :
            this.resumeService.getResumeObservable(resumeId)
    }

    ngOnInit() {
        this.job$ = this.authService.isDemoMode() ?
            this.demoService.getJobObservable(this.id) :
            this.jobsService.getJob(this.id);

        this.resumes$ = this.authService.isDemoMode() ?
            of({ resumes: this.demoService.resumeList() }) :
            this.resumeService.getResumesObservable();

        const matches$ = this.authService.isDemoMode() ?
            this.demoService.listMatchesByJobId(this.id) :
            this.matchService.listMatchesByJobId(this.id);

        matches$.subscribe({
            next: (res) => {
                this.resumeMatches.update(() => res);
            }
        });
    }

    getResumeLink(resumeId: number) {
        return `../../../home/resumes/${resumeId}`;
    }

    getJobLink(jobId: number) {
        return `../../../home/jobs/${jobId}`;
    }

    toggleFindMode() {
        this.showFind = !this.showFind;
    }

    findMatch() {
        if (this.authService.isDemoMode()) {
            return;
        }

        if (this.resumeIds.size > 0) {
            this.loading.update(() => true);
            this.matchService.findMatch(this.resumeIds, this.id).subscribe({
                next: (res) => {
                    this.resumeMatches.update(() => [res] as ResumeMatch[]);
                    this.loading.update(() => false);
                    this.showFind = false;
                    this.resumeIds.clear();
                }
            });
        } else {
            alert("Please select at least one resume!");
        }
    }

    deleteMatch() {
        if (this.resumeMatches().length > 0 && !this.authService.isDemoMode()) {
            this.loading.update(() => true);
            this.matchService.deleteMatch(this.resumeMatches()[0].id).subscribe({
                next: (res) => {
                    this.resumeMatches.update(() => []);
                    this.loading.update(() => false);
                }
            })
        }
    }

    addToSet(id: number) {
        if (this.resumeIds.has(id)) {
            this.resumeIds.delete(id);
        } else {
            this.resumeIds.add(id);
        }
    }

    decompress(text: string) {
        return lzString.decompressFromUTF16(text);
    }

    private highLightKeywords(keywords: string[]) {
        const paragraph = document.getElementById("paragraph");
        let pattern = new RegExp(`(?:^|(?<= ))(${keywords.join('|')})(?:(?= )|$)`, 'gi');
        if (paragraph && paragraph.innerHTML) {
            paragraph.innerHTML = paragraph.textContent ?
                paragraph.textContent.replace(pattern, match =>
                    `<mark class="p-0.5 bg-teal-500 text-white rounded-sm shadow-sm text-sm">${match}</mark>`
                ) : "";
        }
    }

    getMatchKeywords() {
        if (this.resumeMatches().length > 0) {
            this.showCoverage = true;
            const matchId = this.resumeMatches()[0].id;

            const matchKeywordObservable = this.authService.isDemoMode() ?
                this.demoService.getMatchKeywords(matchId) :
                this.matchService.getMatchKeywords(matchId);

            matchKeywordObservable.subscribe({
                next: (res) => {
                    setTimeout(() => {
                        const keywords: string[] = JSON.parse(res);
                        this.highLightKeywords(keywords);
                    }, this.authService.isDemoMode() ? 50 : 0);

                }
            })
        }
    }

    hideCoverage() {
        this.showCoverage = false;
    }

    getDate(date: string) {
        return (new Date(date)).toLocaleDateString();
    }
}