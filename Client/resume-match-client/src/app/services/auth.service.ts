import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'console';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  accessToken: WritableSignal<string> = signal("");

  isLoggedIn: WritableSignal<boolean> = signal(false);

  isDemoMode: WritableSignal<boolean> = signal(false);

  userInfo: WritableSignal<{ username: string, email: string, createdAt: string }> = signal({ username: "", email: "", createdAt: "" });

  private apiUrl: string = environment.apiUrl;

  private router: Router = inject(Router);

  constructor(private httpClient: HttpClient) { }

  setAccessToken(newToken: string) {

    const tokenString: string = JSON.stringify(newToken);
    localStorage.setItem('token', tokenString)

    this.accessToken.update(() => newToken);
  }

  setRefreshToken(refreshToken: string) {
    const tokenString: string = JSON.stringify(refreshToken);
    localStorage.setItem('refreshToken', tokenString);
  }

  getAccessToken(): WritableSignal<string> {

    return this.accessToken
  }

  getUser() {
    return this.userInfo;
  }

  hasTokens(): boolean {
    return !!localStorage.getItem('token') && !!localStorage.getItem('refreshToken');;
  }

  refreshTokens(accessToken: string, refreshToken: string): Observable<{ valid: boolean, accessToken?: string }> {

    return this.httpClient.post<{ valid: boolean, accessToken?: string }>(
      `${this.apiUrl}/user/validateTokens`,
      { accessToken, refreshToken }
    );
  }

  createUser(username: string, email: string, password: string) {

    return this.httpClient.post<{ accessToken: string, refreshToken: string }>(
      `${this.apiUrl}/user/create`,
      { username, email, password }
    );
  }

  loginUser(email: string, password: string) {

    return this.httpClient.post<{ accessToken: string, refreshToken: string }>(
      `${this.apiUrl}/user/login`,
      { email, password });
  }

  logout(): void {

    this.isLoggedIn.update(() => false);
    this.accessToken.update(() => "");

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    this.router.navigate(['/'])
  }

  updateRefreshVersion() {
    return this.httpClient.post(`${this.apiUrl}/user/updateRefreshVersion`, {});
  }

  getUserInfo() {
    return this.httpClient.get(`${this.apiUrl}/user/getInfo`);
  }

  initializeUserInfo() {
    this.getUserInfo().subscribe({
      next: (res: any) => {
        this.userInfo.update(() => { return { username: res.username, email: res.email, createdAt: res.createdAt } });
        this.isLoggedIn.update(() => true);
      }
    })
  }

  switchToDemoMode() {
    this.isDemoMode.update(() => true);
  }
}
