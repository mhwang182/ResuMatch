import { Injectable, signal, WritableSignal } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Job } from '../components/job/job.type';
import * as lzString from 'lz-string';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  private apiUrl: string = environment.apiUrl;

  jobsList: WritableSignal<Job[]> = signal([]);

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getJobs() {
    this.httpClient.get(`${this.apiUrl}/job/listWithMatches`)
      .subscribe({
        next: (res) => {
          const response = res as Job[];
          this.jobsList.update(() => response)
        }
      }
      )
  }

  getJob(id: number): Observable<Job> {
    return this.httpClient.get<Job>(`${this.apiUrl}/job/${id}`);
  }

  deleteJob(id: number) {
    this.jobsList.update(() => this.removeJobFromList(id));
    this.httpClient.delete(`${this.apiUrl}/job/${id}`).subscribe();
  }

  removeJobFromList(jobId: number) {
    return this.jobsList().filter(j => j.id != jobId);
  }

  createJob(values: { role: string, company: string, description: string, location: string }) {

    values.description = lzString.compressToUTF16(values.description);

    return this.httpClient.post(`${this.apiUrl}/job/create`, values);
  }

}
