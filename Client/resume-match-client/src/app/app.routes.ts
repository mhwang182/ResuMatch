import { Routes } from '@angular/router';
import { TestComponent } from './components/test.component';
import { HomeComponent } from './components/home.component';
import { RegistrationPage } from './components/registration/registration-page.component';
import { MainPage } from './components/main-page.component';
import { ResumeListContent } from './components/resume/resume-list-content.component';
import { JobsContainer } from './components/job/jobs-container.component';
import { headersInterceptor } from './headers.interceptor';
import { JobViewComponent } from './components/job/job-view.component';
import { CreateResumeForm } from './components/resume/create-resume-form.component';
import { CreateJobForm } from './components/job/create-job-form.component';
import { MatchPageComponent } from './components/match/match-page.component';
import { ResumeViewComponent } from './components/resume/resume-view.component';
import { UserInfoComponent } from './components/user-info.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthGaurd } from './AuthGuard';
import { DemoGaurd } from './DemoGaurd';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "test", component: TestComponent },
    { path: "sign-up", component: RegistrationPage, data: { type: "signUp" } },
    { path: "login", component: RegistrationPage, data: { type: "login" } },
    {
        path: "home", component: MainPage,
        canActivate: [AuthGaurd],
        children: [
            { path: "", component: ResumeListContent },
            { path: "resumes/add", component: CreateResumeForm, canActivate: [DemoGaurd] },
            { path: "resumes/:id", component: ResumeViewComponent },
            { path: "resumes", component: ResumeListContent },
            { path: "jobs/add", component: CreateJobForm, canActivate: [DemoGaurd] },
            { path: "jobs/:id", component: JobViewComponent },
            { path: "jobs", component: JobsContainer },
            { path: "match/:id", component: MatchPageComponent },
            { path: "account", component: UserInfoComponent, canActivate: [DemoGaurd] }
        ]
    }
];
