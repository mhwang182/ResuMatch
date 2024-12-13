import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResumeMatch } from "../ResumeMatch.type";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class MatchService {

    private apiUrl: string = environment.apiUrl;
    //private apiUrl: string = "http://localhost:8787";

    constructor(private HttpClient: HttpClient) { }

    listMatchesByJobId(jobId: number) {
        return this.HttpClient.get<ResumeMatch[]>(`${this.apiUrl}/resume-match/listByJobId/${jobId}`);
    }

    findMatch(resumeIds: Set<number>, jobId: number) {
        return this.HttpClient.post(`${this.apiUrl}/resume-match/findMatch`, { jobId, resumeIds: [...resumeIds] });
    }

    listByResumeId(resumedId: number) {
        return this.HttpClient.get<ResumeMatch[]>(`${this.apiUrl}/resume-match/listByResumeId/${resumedId}`);
    }

    getMatchKeywords(matchId: number) {
        return this.HttpClient.get<string>(`${this.apiUrl}/resume-match/getKeywords/${matchId}`);
    }

    deleteMatch(id: number) {
        return this.HttpClient.delete(`${this.apiUrl}/resume-match/${id}`);
    }
}