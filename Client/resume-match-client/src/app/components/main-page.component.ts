import { Component } from "@angular/core";
import { TopBar } from "./top-bar.component";
import { ResumeListContent } from "./resume/resume-list-content.component";
import { JobsContainer } from "./job/jobs-container.component";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
    selector: 'main-page',
    standalone: true,
    imports: [TopBar, ResumeListContent, JobsContainer, RouterOutlet, RouterLink],
    template: `
        <div class="w-full h-screen flex flex-col">
            <top-bar class="w-full"/>
            <div class="w-full flex justify-center flex-grow">
                <div class="w-full max-w-[1500px] flex space-x-6">
                    <div class="border-t w-48 min-w-48">
                        <div 
                            class="w-full border-b p-3 font-bold text-slate-700 hover:bg-gray-100"
                            [routerLink]="'resumes'"
                        >
                            Resumes
                        </div>
                        <div 
                            class="w-full border-b p-3 font-bold text-slate-700 hover:bg-gray-100"
                            [routerLink]="'jobs'"
                        >
                            Jobs
                        </div>
                        <div 
                            class="w-full border-b p-3 font-bold text-slate-700 hover:bg-gray-100"
                            [routerLink]="'account'"
                        >
                            Account
                        </div>
                    </div>

                    <div class="flex-grow border-t p-3">
                        <router-outlet />
                    </div>
                </div>
            </div>
        </div>
    `
})

export class MainPage {

    selection: string = "resumes";

    onChangeSelection(_selection: string) {
        this.selection = _selection;
    }


}