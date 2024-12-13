import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { AuthService } from './auth.service';
import { Resume } from '../components/resume/resume.type';
import * as lzString from 'lz-string';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private apiUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  resumeList: WritableSignal<Resume[]> = signal([]);

  getResumes() {

    this.httpClient.get(`${this.apiUrl}/resume/list`)
      .subscribe({
        next: (res) => {
          const response = res as { resumes: Resume[] };
          this.resumeList.update(() => response.resumes)
        }
      })
  }

  getResumesObservable() {
    return this.httpClient.get<{ resumes: Resume[] }>(`${this.apiUrl}/resume/list`);
  }

  getResumeObservable(id: number) {
    return this.httpClient.get<Resume>(`${this.apiUrl}/resume/${id}`);
  }

  deleteResume(id: number) {
    this.resumeList.update(() => this.removeResumeFromList(id));
    this.httpClient.delete(`${this.apiUrl}/resume/${id}`).subscribe();
  }

  removeResumeFromList(resumeId: number) {
    return this.resumeList().filter(r => r.id != resumeId);
  }

  createResume(name: string, role: string, description: string, content: string) {

    const compressedContent = lzString.compressToUTF16(content);

    const data = { name, role, description, content: compressedContent };

    return this.httpClient.post(`${this.apiUrl}/resume/create`, data);
  }

  updateResume(id: number, name: string, role: string, description: string, content: string): void {
    const compressedContent = lzString.compressToUTF16(content);

    const data = { name, role, description, content: compressedContent };

    this.httpClient.put(`${this.apiUrl}/resume/${id}`, data).subscribe();
  }

}

