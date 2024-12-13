import { Injectable, signal, WritableSignal } from "@angular/core";
import { Resume } from "../components/resume/resume.type";
import { of } from "rxjs";
import { demoJobs, demoResumes, demoMatches, demoMatchKeywords } from "./demoData";
import { Job } from "../components/job/job.type";
import { ResumeMatch } from "../ResumeMatch.type";


@Injectable({
    providedIn: 'root'
})
export class DemoService {

    private resumes: Resume[] = demoResumes;

    private jobs: Job[] = demoJobs;

    private matches: ResumeMatch[] = demoMatches;

    resumeList: WritableSignal<Resume[]> = signal(this.resumes);

    jobsList: WritableSignal<Job[]> = signal(this.jobs);

    getResumeObservable(resumeId: number) {
        return of(this.resumes.find(r => r.id == resumeId) as Resume);
    }

    getJobObservable(jobId: number) {
        return of(this.jobs.find(j => j.id == jobId));
    }

    listMatchesByJobId(jobId: number) {

        return of([
            this.matches.find(m => m.jobId == jobId) as ResumeMatch
        ])
    }

    getMatchKeywords(matchId: number) {
        return of(demoMatchKeywords[matchId - 1]);
    }

}


