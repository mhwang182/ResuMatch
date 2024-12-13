import { Component, inject, Input } from "@angular/core";
import { CreateResumeForm } from "./create-resume-form.component";
import { ResumeService } from "../../services/resume.service";
import { Observable } from "rxjs";
import { Resume } from "./resume.type";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { DemoService } from "../../services/demo.service";

@Component({
    selector: 'resume-view',
    standalone: true,
    imports: [CreateResumeForm, CommonModule],
    template: `
        <create-resume-form *ngIf="resume$ | async; let resume" [resume]="resume"/>
    `
})
export class ResumeViewComponent {

    @Input() id!: number;

    resume$: Observable<Resume | undefined> = new Observable();

    private resumeService: ResumeService = inject(ResumeService);

    private authService: AuthService = inject(AuthService);

    private demoService: DemoService = inject(DemoService);

    ngOnInit() {

        this.resume$ = this.authService.isDemoMode() ? this.demoService.getResumeObservable(this.id) : this.resumeService.getResumeObservable(this.id);
    }
}